import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Read allowed origins from env, fallback to localhost
  // This allows flexible CORS configuration for different environments
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'];

  // Configure CORS for security and cross-origin requests
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: false, // Set to true if you need cookies/sessions
    maxAge: 86400, // Cache preflight response for 24 hours
  };

  app.enableCors(corsOptions);

  // Register a global exception filter to handle all uncaught errors
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Register a global validation pipe for DTO validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion
      },
    }),
  );

  // Start the application and listen on the configured port
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
}

// Bootstrap the application and handle startup errors
bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
