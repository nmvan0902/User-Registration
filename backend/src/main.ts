import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Security Headers with Helmet
  app.use(helmet());
  
  // Enable CORS with configuration from environment
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    credentials: configService.get('CORS_CREDENTIALS') === 'true',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });

  // Enable global validation pipes with security options
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: configService.get('NODE_ENV') === 'production', // Hide error details in production
  }));

  // Get port from environment variable
  const port = configService.get('PORT', 3001);
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();