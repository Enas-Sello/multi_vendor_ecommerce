import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CustomerModule } from '../customer/customer.module.js';
import { RolesGuard } from '../../guards/roles.guard.js';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
@Module({
  imports: [AuthModule, CustomerModule],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard],
})
export class AdminModule {}
