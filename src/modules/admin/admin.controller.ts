import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard.js';
import type { AuthenticatedRequest } from '../../guards/auth.guard.js';
import { Roles, RolesGuard } from '../../guards/roles.guard.js';
import { AdminService } from './admin.service.js';
import { CreateUserDto, UpdateUserDto } from './admin.dto.js';

@Controller('admin/users')
@ApiTags('Admin - Users')
@ApiCookieAuth('access-cookie')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}
  @Get()
  @ApiOperation({ summary: 'List users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users excluding the current administrator',
  })
  list(@Req() req: Request) {
    return this.admin.list((req as AuthenticatedRequest).user.sub);
  }
  @Post()
  @ApiOperation({ summary: 'Create a user (admin only)' })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() dto: CreateUserDto) {
    return this.admin.create(dto);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (admin only)' })
  @ApiParam({ name: 'id', description: 'User MongoDB ID' })
  @ApiResponse({ status: 200, description: 'User updated' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.admin.update(id, dto);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiParam({ name: 'id', description: 'User MongoDB ID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id') id: string) {
    return this.admin.remove(id);
  }
}
