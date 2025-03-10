import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    // Get the MikroORM instance
    const orm = app.get(MikroORM);

    // Verify database connection
    try {
      await orm.em.getConnection().execute('SELECT 1');
      logger.log('Database connection established successfully');
    } catch (error) {
      logger.error('Failed to connect to the database', error);
      throw error;
    }

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}
bootstrap();
