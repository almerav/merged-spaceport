import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    // Get the MikroORM instance
    const orm = app.get(MikroORM);
    const em = orm.em.fork();

    // Apply global filters and pipes
    app.useGlobalFilters(new DatabaseExceptionFilter(em));
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Verify database connection with retry logic
    let isConnected = false;
    let retries = 0;
    const maxRetries = process.env.NODE_ENV === 'production' ? 5 : 3;
    const retryDelay = 2000; // 2 seconds

    while (!isConnected && retries < maxRetries) {
      try {
        await orm.em.getConnection().execute('SELECT 1');
        isConnected = true;
        logger.log('Database connection established successfully');
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          logger.error(
            `Failed to connect to the database after ${maxRetries} attempts`,
            error,
          );
          throw error;
        }
        logger.warn(
          `Failed to connect to the database. Retrying (${retries}/${maxRetries})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    // Enable CORS
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}
bootstrap();
