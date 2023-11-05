import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthTokenPayload } from '../types';

/* Gets current user from any authenticated http request */
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  let request = context.switchToHttp().getRequest();

  return request.user as AuthTokenPayload;
});
