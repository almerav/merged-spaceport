import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { DatabaseService } from './common/services/database.service';

//Sentry
import './sentry/instrument';
import { AllExceptionsFilter } from './sentry/global.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  let app;

  try {
    // Create NestJS application
    app = await NestFactory.create(AppModule);

    // Get the database service
    const databaseService = app.get(DatabaseService);
    const em = databaseService.getOrmInstance().em.fork();

    // Apply global filters and pipes
    app.useGlobalFilters(
      new DatabaseExceptionFilter(em),
      new AllExceptionsFilter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Enable CORS
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Setup graceful shutdown
    setupGracefulShutdown(app, databaseService, logger);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}

/**
 * Setup graceful shutdown handlers
 * @param app NestJS application instance
 * @param databaseService Database service instance
 * @param logger Logger instance
 */
function setupGracefulShutdown(app, databaseService, logger) {
  const shutdown = async (signal) => {
    logger.log(`Received ${signal} signal. Starting graceful shutdown...`);

    try {
      // First close the HTTP server to stop accepting new connections
      await app.close();
      logger.log('HTTP server closed successfully');

      // Database connections are automatically closed by NestJS lifecycle hooks
      // through the DatabaseService.onModuleDestroy method

      logger.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown', error);
      process.exit(1);
    }
  };

  // Listen for termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
