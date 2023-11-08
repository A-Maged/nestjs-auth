import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmailAndPasswordGuard extends AuthGuard('local') {
  constructor() {
    super({
      property: 'tokens',
    });
  }
}
