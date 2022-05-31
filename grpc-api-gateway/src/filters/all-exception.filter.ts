import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    console.error(exception);

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception.code === Status.UNKNOWN
        ? HttpStatus.AMBIGUOUS
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpStatus).json({
      message: exception.details,
      code: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
