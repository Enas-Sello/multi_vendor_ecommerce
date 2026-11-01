import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';
import { User, UserSchema } from './user.schema.js';
import { CustomerController } from './customer.controller.js';
import { CustomerService } from './customer.service.js';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [MongooseModule, CustomerService],
})
export class CustomerModule {}
