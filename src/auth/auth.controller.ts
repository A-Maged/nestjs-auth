import { Body, Controller, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateClientDTO } from 'src/users/dtos/create-client.dto';
import { EmailAndPasswordGuard } from './guards/email-and-password-auth.guard';
import { Public } from './decorators/public';
import { JWTTokens } from './types';
import { ImageUploadException } from './exceptions/image-upload.exception';

const ONE_MEGA_BYTE_IN_BYTES = 1000000;

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(EmailAndPasswordGuard)
  @Post('login')
  async login(@Request() req: Express.Request) {
    return req.user as JWTTokens;
  }

  @Public()
  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'photos', maxCount: 10 },
    ]),
  )
  async register(
    @Body() body: CreateClientDTO,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: { avatar?: Express.Multer.File; photos?: Express.Multer.File[] },
  ) {
    if (files.photos.length < 4) {
      throw new ImageUploadException();
    }

    return this.authService.register(body);
  }
}
