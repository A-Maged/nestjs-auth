import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailConflictException extends HttpException {
  constructor(email: string) {
    super(`User with email [${email}] already exists`, HttpStatus.CONFLICT);
  }
}
