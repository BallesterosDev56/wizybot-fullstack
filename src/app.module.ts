import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentModule } from './agent/agent.module';
import { OpenaiModule } from './openai/openai.module';

/**
 * Root Application Module
 *
 * Main entry point for the WizyBot application
 * Orchestrates all feature modules
 *
 * @author Daniel Ballesteros
 */
@Module({
  imports: [AgentModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
