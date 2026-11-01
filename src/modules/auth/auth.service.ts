import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import { Model } from 'mongoose';
import { User } from '../customer/user.schema.js';
import type { UserDocument, UserRole } from '../customer/types.js';
import { USER_ROLES } from '../customer/types.js';
import type { LoginDto, RegisterDto } from './auth.dto.js';

const scrypt = promisify(scryptCallback);
const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_TTL_MS = 60 * 60 * 24 * 7 * 1000;

@Injectable()
export class AuthService {
  private readonly secret: string;

  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    config: ConfigService,
  ) {
    this.secret = config.getOrThrow<string>('auth.jwtSecret');
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.exists({ email }))
      throw new ConflictException('Email is already registered');
    const salt = randomBytes(16).toString('hex');
    const passwordHash = `${salt}:${((await scrypt(dto.password, salt, 64)) as Buffer).toString('hex')}`;
    try {
      const user = await this.users.create({
        name: dto.name.trim(),
        email,
        passwordHash,
        role: 'customer' as UserRole,
      });
      return this.publicUser(user);
    } catch (error) {
      if ((error as { code?: number }).code === 11000)
        throw new ConflictException('Email is already registered');
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.users
      .findOne({ email: dto.email.trim().toLowerCase() })
      .select('+passwordHash');
    if (
      !user ||
      !(await this.verifyPassword(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive)
      throw new UnauthorizedException('Account is deactivated');
    return { user: this.publicUser(user), ...(await this.createSession(user)) };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token required');
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const user = await this.users
      .findOne({
        refreshTokenHash,
        refreshTokenExpiresAt: { $gt: new Date() },
        isActive: true,
      })
      .select('+refreshTokenHash +refreshTokenExpiresAt');
    if (!user)
      throw new UnauthorizedException('Invalid or expired refresh token');

    const nextRefreshToken = randomBytes(48).toString('base64url');
    const updated = await this.users.findOneAndUpdate(
      {
        _id: user._id,
        refreshTokenHash,
        refreshTokenExpiresAt: { $gt: new Date() },
        isActive: true,
      },
      {
        $set: {
          refreshTokenHash: this.hashRefreshToken(nextRefreshToken),
          refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
      },
      { new: true },
    );
    if (!updated)
      throw new UnauthorizedException('Refresh token has already been used');
    return {
      user: this.publicUser(updated),
      accessToken: this.createToken(updated),
      refreshToken: nextRefreshToken,
    };
  }

  async revokeRefreshToken(refreshToken?: string) {
    if (!refreshToken) return;
    await this.users.updateOne(
      { refreshTokenHash: this.hashRefreshToken(refreshToken) },
      { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 } },
    );
  }

  private async createSession(user: UserDocument) {
    const refreshToken = randomBytes(48).toString('base64url');
    await this.users.updateOne(
      { _id: user._id, isActive: true },
      {
        $set: {
          refreshTokenHash: this.hashRefreshToken(refreshToken),
          refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
      },
    );
    return { accessToken: this.createToken(user), refreshToken };
  }

  private hashRefreshToken(token: string): string {
    return createHmac('sha256', this.secret).update(token).digest('hex');
  }

  authenticate(token: string): { sub: string; email: string; role: UserRole } {
    const [payload, signature, extra] = token.split('.');

    if (!payload || !signature || extra)
      throw new UnauthorizedException('Invalid session');

    const expected = this.sign(payload);
    const actualBytes = Buffer.from(signature);
    const expectedBytes = Buffer.from(expected);

    if (
      actualBytes.length !== expectedBytes.length ||
      !timingSafeEqual(actualBytes, expectedBytes)
    )
      throw new UnauthorizedException('Invalid session');

    try {
      const claims = JSON.parse(
        Buffer.from(payload, 'base64url').toString(),
      ) as { sub: string; email: string; role: UserRole; exp: number };

      if (
        !claims.sub ||
        !claims.email ||
        !USER_ROLES.includes(claims.role) ||
        claims.exp <= Date.now() / 1000
      )
        throw new Error();

      return { sub: claims.sub, email: claims.email, role: claims.role };
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  async authenticateActive(
    token: string,
  ): Promise<{ sub: string; email: string; role: UserRole }> {
    const session = this.authenticate(token);
    const user = await this.users.findById(session.sub).select('isActive');
    if (!user?.isActive)
      throw new UnauthorizedException('Account is deactivated');
    return session;
  }

  private createToken(user: UserDocument): string {
    const payload = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS,
      }),
    ).toString('base64url');

    return `${payload}.${this.sign(payload)}`;
  }

  private sign(value: string): string {
    return createHmac('sha256', this.secret).update(value).digest('base64url');
  }

  private async verifyPassword(
    password: string,
    encoded: string,
  ): Promise<boolean> {
    const [salt, hash] = encoded.split(':');
    if (!salt || !hash) return false;
    const actual = (await scrypt(password, salt, 64)) as Buffer;
    const expected = Buffer.from(hash, 'hex');
    return (
      actual.length === expected.length && timingSafeEqual(actual, expected)
    );
  }

  private publicUser(user: UserDocument) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
