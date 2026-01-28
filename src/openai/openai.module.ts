import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';

/**
 * OpenAI Module
 *
 * Encapsulates OpenAI API integration
 * Provides AI capabilities to other modules
 */
@Module({
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
