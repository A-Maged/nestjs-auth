import { Controller, ForbiddenException, Get, Param, StreamableFile } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { createReadStream } from 'fs';
import { getUploadPath } from 'src/utils';
import { ClientsService } from './clients.service';

type GetImageParams = {
  ownerEmail: string;
  fileCategory: string;
  fileName: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly clientService: ClientsService) {}

  @Get('/profile')
  async profile(@CurrentUser() user: User) {
    return user;
  }

  @Get('/photos')
  async photos(@CurrentUser() user: User) {
    return this.clientService.getPhotosUrls(user.id);
  }

  @Get('/images/:ownerEmail/:fileCategory/:fileName')
  getImage(@CurrentUser() user: User, @Param() params: GetImageParams): StreamableFile {
    if (params.ownerEmail !== user.email) {
      throw new ForbiddenException({
        error: 'You do not have permission to access this resource',
      });
    }

    const filePath = getUploadPath({
      userIdentifier: user.email,
      fileDir: params.fileCategory,
      fileName: params.fileName,
    });

    const file = createReadStream(filePath);

    return new StreamableFile(file);
  }
}
