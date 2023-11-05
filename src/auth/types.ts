import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { omit, pick } from 'pick-omit';
import { Client } from 'src/users/entities/client.entity';
import { User } from 'src/users/entities/user.entity';

export type AuthTokenPayload = Omit<User | Client, 'password'>;

export type JWTTokens = { accessToken: string; refreshToken: string };
