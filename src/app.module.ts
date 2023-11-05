import { Module } from '@nestjs/common';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CustomConfigModule, DatabaseModule, UsersModule, AuthModule],
})
export class AppModule {}
