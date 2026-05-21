import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RATE_LIMIT_MESSAGE } from '../../config/rate-limit.config';

type HttpErrorBody = {
  message?: string | string[];
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getMessage(exception);

    response.status(status).json({
      code: status,
      data: null,
      message: Array.isArray(message) ? message[0] : message,
    });
  }

  private getMessage(exception: unknown): string | string[] {
    if (!(exception instanceof HttpException)) {
      return 'Internal server error';
    }

    if (exception.getStatus() === HttpStatus.TOO_MANY_REQUESTS) {
      return RATE_LIMIT_MESSAGE;
    }

    const exceptionResponse = exception.getResponse();
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      return (exceptionResponse as HttpErrorBody).message || exception.message;
    }

    return exception.message;
  }
}
