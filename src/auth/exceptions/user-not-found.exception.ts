import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiError } from 'src/types';

export class UserNotFoundException extends HttpException {
  constructor(email: string, fieldName: string = 'error') {
    const error: ApiError = {
      [fieldName]: [`User with email [${email}] not found`],
    };

    super(error, HttpStatus.NOT_FOUND);
  }
}
