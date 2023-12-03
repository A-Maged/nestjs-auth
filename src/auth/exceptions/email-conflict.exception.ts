import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiError } from 'src/types';

export class EmailConflictException extends HttpException {
  constructor(email: string, fieldName: string = 'error') {
    const error: ApiError = {
      [fieldName]: [`User with email [${email}] already exists`],
    };

    super(error, HttpStatus.CONFLICT);
  }
}
