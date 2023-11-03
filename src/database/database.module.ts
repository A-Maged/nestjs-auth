import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptionsFactory } from './connection/options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmOptionsFactory,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
