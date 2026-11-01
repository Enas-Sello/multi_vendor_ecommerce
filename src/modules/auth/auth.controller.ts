import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthGuard, AuthenticatedRequest } from '../../guards/auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';

const COOKIE_NAME = 'auth_token';
const REFRESH_COOKIE_NAME = 'refresh_token';
const ACCESS_COOKIE_TTL_MS = 15 * 60 * 1000;
const REFRESH_COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a customer account' })
  @ApiResponse({ status: 201, description: 'Customer account created' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in and set access and refresh cookies' })
  @ApiResponse({
    status: 201,
    description:
      'Signed in; sets auth_token and refresh_token HttpOnly cookies',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.login(dto);
    this.setSessionCookies(response, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post('refresh')
  @ApiCookieAuth('refresh-cookie')
  @ApiOperation({
    summary: 'Rotate the refresh cookie and issue a new access cookie',
  })
  @ApiResponse({ status: 201, description: 'Cookies rotated' })
  @ApiResponse({ status: 401, description: 'Refresh cookie is missing, invalid, or expired' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.refresh(
      this.readCookie(request, REFRESH_COOKIE_NAME),
    );
    this.setSessionCookies(response, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post('logout')
  @ApiCookieAuth('refresh-cookie')
  @ApiOperation({ summary: 'Revoke the refresh token and clear auth cookies' })
  @ApiResponse({ status: 201, description: 'Session revoked and cookies cleared' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.revokeRefreshToken(
      this.readCookie(request, REFRESH_COOKIE_NAME),
    );
    response.clearCookie(COOKIE_NAME, this.cookieOptions('/'));
    response.clearCookie(REFRESH_COOKIE_NAME, this.cookieOptions('/auth'));
    return { message: 'Logged out' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiCookieAuth('access-cookie')
  @ApiOperation({ summary: 'Get the signed-in user session' })
  @ApiResponse({ status: 200, description: 'Authenticated session details' })
  @ApiResponse({ status: 401, description: 'Access cookie is missing, invalid, or expired' })
  me(@Req() request: Request) {
    return (request as AuthenticatedRequest).user;
  }

  private setSessionCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie(COOKIE_NAME, accessToken, {
      ...this.cookieOptions('/'),
      maxAge: ACCESS_COOKIE_TTL_MS,
    });
    response.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...this.cookieOptions('/auth'),
      maxAge: REFRESH_COOKIE_TTL_MS,
    });
  }

  private cookieOptions(path: string) {
    return {
      httpOnly: true,
      secure: this.config.get('nodeEnv') === 'production',
      sameSite: 'lax' as const,
      path,
    };
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookie = request.headers.cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`));
    return cookie
      ? decodeURIComponent(cookie.slice(name.length + 1))
      : undefined;
  }
}
