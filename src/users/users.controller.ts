import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  @Get('/me')
  async me(@CurrentUser() user: User) {
    return user;
  }
}
