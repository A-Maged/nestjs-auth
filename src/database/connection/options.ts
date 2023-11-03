import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export function typeOrmOptionsFactory(configService: ConfigService): TypeOrmModuleOptions {
  const nodeEnv = configService.get('NODE_ENV');
  const isSynchronizeEnabled = nodeEnv === 'development';

  return {
    ...dataSourceOptionsFactory(configService),
    synchronize: isSynchronizeEnabled,
    autoLoadEntities: true,
  };
}

export function dataSourceOptionsFactory(configService: ConfigService): DataSourceOptions {
  const nodeEnv = configService.get('NODE_ENV');
  const isLoggingEnabled = nodeEnv === 'development';

  return {
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: +configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    logging: isLoggingEnabled,
    entities: [__dirname + '/../../**/*.entity.ts'],
    migrations: [__dirname + '/../migrations/**'],
  };
}
