import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns API status and basic information',
  })
  @ApiResponse({
    status: 200,
    description: 'API is operational',
    schema: {
      example: {
        message: 'WizyBot API is running',
        version: '1.0.0',
        status: 'healthy',
      },
    },
  })
  getApiStatus(): Record<string, string> {
    return this.appService.getApiStatus();
  }
}
