import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  // Main exception handler for all uncaught exceptions in the app
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default error response values
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let error: string = 'InternalServerError';

    // Handle HTTP exceptions (thrown by NestJS or manually)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        // Simple string error message
        message = exceptionResponse;
        error = exception.name;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // Structured error response (e.g., from ValidationPipe)
        const resp = exceptionResponse as Record<string, unknown>;
        message =
          typeof resp.message === 'string' || Array.isArray(resp.message)
            ? resp.message
            : exception.message;
        error = typeof resp.error === 'string' ? resp.error : exception.name;
      } else {
        // Fallback for unknown structure
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle database errors
      status = HttpStatus.BAD_REQUEST;
      message = 'A database error occurred.';
      error = 'DatabaseError';
      this.logger.error(
        `Database Error: ${exception.message}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      // Handle generic JS errors
      message = exception.message || message;
      error = exception.name || error;
      this.logger.error(
        `Unexpected Error: ${exception.message}`,
        exception.stack,
      );
    } else {
      // Handle truly unknown errors
      this.logger.error('Unknown Error:', String(exception));
    }

    // Build the error response object
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log error or warning based on status code
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} ${status} - ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} ${status} - ${JSON.stringify(message)}`,
      );
    }

    // Send the error response to the client
    response.status(status).json(errorResponse);
  }
}
