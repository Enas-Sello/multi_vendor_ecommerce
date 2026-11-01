import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { validationSchema } from './config/validation.schema.js';
import { DatabaseModule } from './database/database.module.js';
import { CustomerModule } from './modules/customer/customer.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { SellerModule } from './modules/seller/seller.module.js';
import { SupportModule } from './modules/support/support.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    CustomerModule,
    AdminModule,
    ProductsModule,
    SellerModule,
    SupportModule,

    // ObserveModule.forRoot({
    //   appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
    //   appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
    //   serviceId: 'nestjs',
    // }),
  ],
})
export class AppModule {}
