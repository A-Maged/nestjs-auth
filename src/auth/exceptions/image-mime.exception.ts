import { HttpException, HttpStatus } from '@nestjs/common';

export class ImageMimeException extends HttpException {
  constructor(mimetype: string) {
    super(`Image Mime type ${mimetype} not supported`, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
}
