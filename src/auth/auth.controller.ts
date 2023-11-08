import { Body, Controller, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateClientDTO } from 'src/users/dtos/create-client.dto';
import { EmailAndPasswordGuard } from './guards/email-and-password-auth.guard';
import { Public } from './decorators/public';
import { JWTTokens } from './types';
import { ImageUploadException } from './exceptions/image-upload.exception';
import { RegisterClientDTO } from './dtos/register-client.dto';
import { FileTypeValidationPipe } from './file-type-validation.pipe';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(EmailAndPasswordGuard)
  @Post('login')
  async login(@Request() req: { tokens: JWTTokens }) {
    return req.tokens;
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
    @Body() body: RegisterClientDTO,
    @UploadedFiles(new FileTypeValidationPipe())
    files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[] },
  ) {
    if (files.photos.length < 4) {
      throw new ImageUploadException();
    }

    const authTokens = await this.authService.register(body, files);

    return authTokens;
  }
}
