import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  /**
   * Processes user queries through the AI assistant
   *
   * This endpoint accepts natural language input and returns intelligent responses.
   * The system automatically determines whether to use product search, currency
   * conversion, or other available tools to fulfill the request.
   */
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send a query to the AI shopping assistant',
    description:
      'Submit a natural language query to get product recommendations, currency conversions, or general shopping assistance. The AI automatically selects the appropriate tools to fulfill your request.',
  })
  @ApiBody({
    description: 'User query in natural language',
    type: UserQueryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully processed query and generated response',
    schema: {
      example: {
        response:
          'Here are some great phones I found:\n\n1. Samsung Galaxy S23\n   - Price: $899 USD\n   - High-quality camera and display\n   - [View Product](...)',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request - check query format and content',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed: query must not be empty',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Server error - AI service or tool execution failed',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to process query',
        error: 'Internal Server Error',
      },
    },
  })
  async processUserQuery(
    @Body() requestData: UserQueryDto,
  ): Promise<{ response: string }> {
    const assistantResponse = await this.agentService.handleQuery(
      requestData.query,
    );
    return { response: assistantResponse };
  }
}
