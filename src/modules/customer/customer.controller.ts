import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthGuard,
  type AuthenticatedRequest,
} from '../../guards/auth.guard.js';
import { CustomerService } from './customer.service.js';
import { UpdateProfileDto } from './customer.dto.js';

@Controller('customer/profile')
@ApiTags('Customer - Profile')
@ApiCookieAuth('access-cookie')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customers: CustomerService) {}
  @Get() @ApiOperation({ summary: 'View your profile' }) @ApiResponse({ status: 200, description: 'Current user profile' }) profile(
    @Req() req: Request,
  ) {
    return this.customers.profile((req as AuthenticatedRequest).user.sub);
  }
  @Patch() @ApiOperation({ summary: 'Update your profile' }) @ApiResponse({ status: 200, description: 'Updated user profile' }) update(
    @Req() req: Request,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.customers.update((req as AuthenticatedRequest).user.sub, dto);
  }
  @Delete() @ApiOperation({ summary: 'Deactivate your account' }) @ApiResponse({ status: 200, description: 'Account deactivated' }) deactivate(
    @Req() req: Request,
  ) {
    return this.customers.deactivate((req as AuthenticatedRequest).user.sub);
  }
}
