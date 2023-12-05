import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthTokenPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([AccessTokenStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    };

    super(strategyOptions);
  }

  async validate(payload: AuthTokenPayload) {
    /* jwt is already validated, 
       but u can do more validation here  */

    /* return value is attached to current request as "user" */

    return payload;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }

    return null;
  }
}
