import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Application bootstrap and initialization
 *
 * Configures the NestJS application with:
 * - Global validation pipes for request DTOs
 * - Swagger/OpenAPI documentation
 * - Server port configuration
 */
async function bootstrap() {
  const application = await NestFactory.create(AppModule);

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
