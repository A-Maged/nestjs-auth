import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmailAndPasswordGuard } from './guards/email-and-password-auth.guard';
import { Public } from './decorators/public';
import { JWTTokens } from './types';
import { ImageCountException } from './exceptions/image-count.exception';
import { RegisterClientDTO } from './dtos/register-client.dto';
import { Response } from 'express';
import { uploadFiles, validateImageMimeType, writeFileWithDirectories } from 'src/utils';
import { ImageMimeException } from './exceptions/image-mime.exception';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(EmailAndPasswordGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: { tokens: JWTTokens }, @Res({ passthrough: true }) response: Response) {
    response
      .cookie('access_token', req.tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 900000,
      })
      .send(req.tokens);
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
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[] },
    @Res({ passthrough: true }) response: Response,
  ) {
    const uploadFileWithWrongType = [files?.photos, files.avatar].flat()?.find(validateImageMimeType);

    if (uploadFileWithWrongType) {
      throw new ImageMimeException(uploadFileWithWrongType.mimetype, uploadFileWithWrongType.fieldname);
    }

    if (!files?.photos?.length || files?.photos?.length < 4) {
      throw new ImageCountException(4, 'photos');
    }

    const authTokens = await this.authService.register(body, files);

    uploadFiles({
      files: [files.avatar, files.photos].flat(),
      userIdentifier: body.email,
    });

    response
      .cookie('access_token', authTokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 900000,
      })
      .send(authTokens);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
  }
}
