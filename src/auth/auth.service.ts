import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from 'src/users/clients.service';
import { CreateClientDTO } from 'src/users/dtos/create-client.dto';
import * as bcrypt from 'bcrypt';
import { Client } from 'src/users/entities/client.entity';
import { ConfigService } from '@nestjs/config';
import { pick } from 'pick-omit';
import { JWTTokens } from './types';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { EmailConflictException } from './exceptions/email-conflict.exception';
import { RegisterClientDTO } from './dtos/register-client.dto';

@Injectable()
export class AuthService {
  constructor(
    public configService: ConfigService,
    private clientsService: ClientsService,
    public jwtService: JwtService,
  ) {}

  async register(
    registerClientDTO: RegisterClientDTO,
    files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[] },
  ): Promise<JWTTokens> {
    const foundUser = await this.clientsService.findOneByEmail(registerClientDTO.email);

    if (foundUser) {
      throw new EmailConflictException(registerClientDTO.email, 'email');
    }

    const passwordHash = await this.hash(registerClientDTO.password);

    const payload: CreateClientDTO = {
      ...registerClientDTO,
      password: passwordHash,
      avatar: files.avatar?.[0].originalname,
      photos: files.photos?.map((f) => ({
        url: f.originalname,
        name: f.originalname,
      })),
    };

    const newUser = await this.clientsService.create(payload);

    return this.generateAuthTokens(newUser);
  }

  async getUserWithLoginCredentials({ email, password }: { email: string; password: string }) {
    const client = await this.clientsService.findOneByEmail(email);

    if (!client) {
      throw new UserNotFoundException(email, 'email');
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      throw new UnauthorizedException({
        password: ['wrong password'],
      });
    }

    return client;
  }

  async generateAuthTokens(user: Client): Promise<JWTTokens> {
    const payload = pick(user, ['id', 'firstName', 'lastName', 'email', 'role', 'avatar']);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async hash(text: string) {
    const salt = await bcrypt.genSalt();
    const textHash = await bcrypt.hash(text, salt);
    return textHash;
  }
}
