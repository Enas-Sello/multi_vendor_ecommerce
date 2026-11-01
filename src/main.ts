import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import configuration from './config/configuration.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './utils/transform.interceptor.js';

async function bootstrap() {
  const { port, nodeEnv } = configuration();

  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  // swager
  const config = new DocumentBuilder()
    .setTitle('multi vendor ecommerce')
    .setDescription('The multi vendor ecommerce API description')
    .setVersion('1.0')
    .addCookieAuth('auth_token', { type: 'apiKey', in: 'cookie', name: 'auth_token' }, 'access-cookie')
    .addCookieAuth('refresh_token', { type: 'apiKey', in: 'cookie', name: 'refresh_token' }, 'refresh-cookie')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);

  if (nodeEnv !== 'production') {
    Logger.log(`Swagger documentation: ${await app.getUrl()}/api`);
  } else Logger.log(`Application running on: ${await app.getUrl()}`);
}

await bootstrap();
