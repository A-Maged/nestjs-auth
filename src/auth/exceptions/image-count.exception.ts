import { HttpException, HttpStatus } from '@nestjs/common';

export class ImageCountException extends HttpException {
  constructor() {
    super('You must upload at least 4 images for registration', HttpStatus.BAD_REQUEST);
  }
}
