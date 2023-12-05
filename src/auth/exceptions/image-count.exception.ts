import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiError } from 'src/types';

export class ImageCountException extends HttpException {
  constructor(count: number, fieldName: string = 'error') {
    const error: ApiError = {
      [fieldName]: [`You must upload at least ${count} images for registration`],
    };

    super(error, HttpStatus.BAD_REQUEST);
  }
}
