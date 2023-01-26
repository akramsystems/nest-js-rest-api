import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// createParamDecorator is a function that returns a function
// that takes two arguments: data and ctx
export const GetUser = createParamDecorator(
  // data is the data passed to the decorator
  // ctx is the execution context
  (data: string | undefined, ctx: ExecutionContext) => {
    // ctx.switchToHttp() is a method that returns a HttpArgumentsHost object
    // which has a getRequest() method that returns the request object
    // which has a user property that is the user object
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
