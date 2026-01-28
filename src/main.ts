import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { displayStartupBanner } from './common/utils/startup-banner';

/**
 * Application bootstrap and initialization
 *
 * Configures the NestJS application with:
 * - Global validation pipes for request DTOs
 * - Swagger/OpenAPI documentation
 * - Server port configuration
 */
async function bootstrap() {
  // Display startup banner
  displayStartupBanner();
  const application = await NestFactory.create(AppModule);

  // Enable CORS for frontend access
  application.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://wizybot-ui.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable automatic request validation
  application.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure API documentation
  const apiDocConfig = new DocumentBuilder()
    .setTitle('WizyBot API')
    .setDescription(
      'AI-powered shopping assistant with product search and currency conversion capabilities. ' +
        'Built with NestJS and OpenAI GPT-3.5 Turbo.',
    )
    .setVersion('1.0.0')
    .addTag('Agent', 'AI assistant endpoints')
    .build();

  const apiDocument = SwaggerModule.createDocument(application, apiDocConfig);
  SwaggerModule.setup('docs', application, apiDocument);

  const serverPort = process.env.PORT ?? 3000;
  await application.listen(serverPort);

  console.log(`🚀 WizyBot API is running on: http://localhost:${serverPort}`);
  console.log(`📚 API Documentation: http://localhost:${serverPort}/docs`);
}

void bootstrap();
