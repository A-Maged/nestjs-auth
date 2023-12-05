import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserRole } from 'src/users/types';
import { Request } from 'express';

@Injectable()
export class EmailAndPasswordPassportStrategy extends PassportStrategy(Strategy) {
  constructor(private clientAuthService: AuthService) {
    const strategyOptions: IStrategyOptionsWithRequest = {
      usernameField: 'email',
      passReqToCallback: true,
    };

    super(strategyOptions);
  }

  async validate(req: Request, email: string, password: string) {
    if (!UserRole[req.body['role']]) {
      throw new UnauthorizedException({
        role: ['wrong user role'],
      });
    }

    const user = await this.clientAuthService.getUserWithLoginCredentials({ email, password });

    const authTokens = await this.clientAuthService.generateAuthTokens(user);

    return authTokens;
  }
}
