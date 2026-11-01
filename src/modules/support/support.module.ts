import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../../guards/roles.guard.js';
import { CustomerModule } from '../customer/customer.module.js';
import { SupportController } from './support.controller.js';

@Module({
  imports: [AuthModule, CustomerModule],
  controllers: [SupportController],
  providers: [RolesGuard],
})
export class SupportModule {}
