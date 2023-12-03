import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiError } from 'src/types';

export class ImageMimeException extends HttpException {
  constructor(mimetype: string, fieldName: string = 'error') {
    const error: ApiError = {
      [fieldName]: [`Image Mime type ${mimetype} not supported`],
    };

    super(error, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
}
