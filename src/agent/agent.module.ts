import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { OpenaiModule } from '../openai/openai.module';

/**
 * Agent Module
 *
 * Core module for the AI agent functionality
 * Handles user queries and orchestrates tool execution
 */
@Module({
  imports: [OpenaiModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
