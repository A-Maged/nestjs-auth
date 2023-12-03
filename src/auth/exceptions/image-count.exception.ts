import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiError } from 'src/types';

export class ImageCountException extends HttpException {
  constructor(fieldName: string = 'error') {
    const error: ApiError = {
      [fieldName]: ['You must upload at least 4 images for registration'],
    };

    super(error, HttpStatus.BAD_REQUEST);
  }
}
