import { Controller, ForbiddenException, Get, Param, StreamableFile } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { getUploadPath } from 'src/utils';

@Controller('users')
export class UsersController {
  @Get('/profile')
  async profile(@CurrentUser() user: User) {
    return user;
  }

  @Get('/images/:ownerEmail/:fileName')
  getFile(
    @CurrentUser() user: User,
    @Param('ownerEmail') ownerEmail: string,
    @Param('fileName') fileName: string,
  ): StreamableFile {
    if (ownerEmail !== user.email) {
      throw new ForbiddenException({
        error: 'You do not have permission to access this resource',
      });
    }

    const filePath = getUploadPath({
      userIdentifier: user.email,
      fileDir: ownerEmail,
      fileName,
    });

    const file = createReadStream(join(process.cwd(), filePath));

    return new StreamableFile(file);
  }
}
