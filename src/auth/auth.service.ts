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

@Injectable()
export class AuthService {
  constructor(
    public configService: ConfigService,
    private clientsService: ClientsService,
    public jwtService: JwtService,
  ) {}

  async register(createClientDTO: CreateClientDTO): Promise<JWTTokens> {
    const foundUser = await this.clientsService.findOneByEmail(createClientDTO.email);

    if (foundUser) {
      throw new EmailConflictException(createClientDTO.email);
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createClientDTO.password, salt);

    const newUser = await this.clientsService.create({ ...createClientDTO, password: passwordHash });

    return this.generateAuthTokens(newUser);
  }

  async getUserWithLoginCredentials({ email, password }: { email: string; password: string }) {
    const client = await this.clientsService.findOneByEmail(email);

    if (!client) {
      throw new UserNotFoundException(email);
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return client;
  }

  async generateAuthTokens(user: Client): Promise<JWTTokens> {
    const payload = pick(user, ['firstName', 'lastName', 'email', 'role']);

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
}
