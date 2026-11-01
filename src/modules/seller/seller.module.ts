import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ProductsModule } from '../products/products.module.js';
import { RolesGuard } from '../../guards/roles.guard.js';
import { SellerController } from './seller.controller.js';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [SellerController],
  providers: [RolesGuard],
})
export class SellerModule {}
