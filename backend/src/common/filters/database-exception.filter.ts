import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  EntityManager,
  UniqueConstraintViolationException,
  ValidationError,
} from '@mikro-orm/core';

/**
 * Database exception filter to handle MikroORM and database-related errors
 */
@Catch(UniqueConstraintViolationException, ValidationError, Error)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  constructor(private readonly em: EntityManager) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Log the error with details
    this.logger.error(`Database error: ${exception.message}`, exception.stack);

    // Handle different types of database errors
    if (exception instanceof UniqueConstraintViolationException) {
      // Extract the field name from the error message
      const match = exception.message.match(
        /unique constraint violation: (.+)/i,
      );
      const field = match ? match[1].split('.').pop() : 'field';

      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: `A record with this ${field} already exists`,
        error: 'Conflict',
      });
    }

    if (exception instanceof ValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: 'Bad Request',
      });
    }

    // Handle generic database errors by checking error properties and messages
    const pgError = (exception as any).cause;

    if (pgError?.code) {
      // PostgreSQL error codes
      if (pgError.code === '23505') {
        // unique_violation
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with these details already exists',
          error: 'Conflict',
        });
      }

      if (pgError.code === '23503') {
        // foreign_key_violation
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Referenced record does not exist',
          error: 'Bad Request',
        });
      }

      if (pgError.code === '42P01') {
        // undefined_table
        this.logger.error(`Table does not exist: ${pgError.message}`);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: 'Internal Server Error',
        });
      }
    }

    // Check for connection errors
    if (
      exception.message.includes('ECONNREFUSED') ||
      exception.message.includes('connection') ||
      exception.message.includes('timeout')
    ) {
      this.logger.error(`Database connection error: ${exception.message}`);
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Database service unavailable',
        error: 'Service Unavailable',
      });
    }

    // Default error response
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }
}
