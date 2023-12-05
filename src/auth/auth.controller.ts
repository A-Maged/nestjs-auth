import { Body, Controller, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmailAndPasswordGuard } from './guards/email-and-password-auth.guard';
import { Public } from './decorators/public';
import { JWTTokens } from './types';
import { ImageCountException } from './exceptions/image-count.exception';
import { RegisterClientDTO } from './dtos/register-client.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(EmailAndPasswordGuard)
  @Post('login')
  async login(@Req() req: { tokens: JWTTokens }, @Res({ passthrough: true }) response: Response) {
    response
      .cookie('access_token', req.tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
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
    if (!files?.photos?.length || files?.photos?.length < 4) {
      throw new ImageCountException(4, 'photos');
    }

    const authTokens = await this.authService.register(body, files);

    response
      .cookie('access_token', authTokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 900000,
      })
      .send(authTokens);
  }
}
