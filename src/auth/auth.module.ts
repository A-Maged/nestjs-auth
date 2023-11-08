import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmailAndPasswordPassportStrategy } from './strategies/email-and-password.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenAuthGuard } from './guards/access-token.guard';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, cb) {
          const filepath = file.fieldname !== 'avatar' ? `uploaded/${file.fieldname}` : `public/${file.fieldname}`;
          cb(null, filepath);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      /* protect all routes */
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
    AuthService,
    EmailAndPasswordPassportStrategy,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
