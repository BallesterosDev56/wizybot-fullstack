import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentModule } from './agent/agent.module';
import { OpenaiModule } from './openai/openai.module';
import { NestApplication } from '@nestjs/core';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';

/**
 * Root Application Module
 *
 * Main entry point for the WizyBot application
 * Orchestrates all feature modules
 * uses global logger
 *
 * @author Daniel Ballesteros
 */
@Module({
  imports: [AgentModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes("*")
  }
}
