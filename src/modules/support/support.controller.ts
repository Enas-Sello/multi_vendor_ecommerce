import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard.js';
import { Roles, RolesGuard } from '../../guards/roles.guard.js';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('support')
@ApiTags('Support')
@ApiCookieAuth('access-cookie')
@UseGuards(AuthGuard, RolesGuard)
@Roles('support')
export class SupportController {
  @Get('status')
  @ApiOperation({ summary: 'Get support role status' })
  @ApiResponse({ status: 200, description: 'Support account status' })
  status() {
    return { role: 'support', status: 'active' };
  }
}
