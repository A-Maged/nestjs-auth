import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ApiError } from './types';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result: ApiError = {};

        errors.forEach((error) => {
          result[error.property] = Object.values(error.constraints);
        });

        return new HttpException(result, HttpStatus.BAD_REQUEST);
      },
    }),
  );

  await app.listen(port, () => {
    console.log(`Service started at port: ${port}`);
  });
}
bootstrap();
