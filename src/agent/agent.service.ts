import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { searchProducts } from './tools/search-products';
import { convertCurrencies } from './tools/convert-currencies';

@Injectable()
export class AgentService {
  constructor(private readonly openaiService: OpenaiService) {}

  /**
   * Processes a user query through the AI assistant pipeline
   *
   * This method orchestrates the entire query handling flow:
   * 1. Sends query to OpenAI for analysis
   * 2. Detects if tools are needed (product search, currency conversion)
   * 3. Executes appropriate tools with parsed parameters
   * 4. Returns AI-generated response incorporating tool results
   *
   * @param userQuery - Natural language input from the user
   * @returns AI-generated response string
   */
  async handleQuery(userQuery: string): Promise<string> {
    const initialResponse =
      await this.openaiService.askWithToolCalling(userQuery);

    const requestedTool = initialResponse.tool_calls?.[0];

    if (
      !requestedTool ||
      !('function' in requestedTool) ||
      !requestedTool.function?.name
    ) {
      return initialResponse.content || 'Unable to generate a response.';
    }

    const toolName = requestedTool.function.name;
    const toolParameters = this.parseToolArguments(
      requestedTool.function.arguments,
    );

    const executionResult = await this.executeToolFunction(
      toolName,
      toolParameters,
    );

    if (
      typeof executionResult === 'string' &&
      executionResult.startsWith('Tool')
    ) {
      return executionResult;
    }

    const finalResponse = await this.openaiService.completeToolResult(
      userQuery,
      requestedTool,
      executionResult,
    );

    return finalResponse.content ?? 'Response generated without content.';
  }

  /**
   * Parses tool arguments from JSON string or object format
   */
  private parseToolArguments(
    argumentsData: string | Record<string, unknown>,
  ): Record<string, unknown> {
    try {
      return typeof argumentsData === 'string'
        ? (JSON.parse(argumentsData) as Record<string, unknown>)
        : argumentsData;
    } catch (error) {
      console.error('Failed to parse tool arguments:', argumentsData, error);
      throw new Error('Malformed tool arguments from AI response.');
    }
  }

  /**
   * Routes tool execution to the appropriate handler function
   */
  private async executeToolFunction(
    toolName: string,
    parameters: Record<string, unknown>,
  ): Promise<unknown> {
    switch (toolName) {
      case 'searchProducts':
        return this.executeProductSearch(parameters);

      case 'convertCurrencies':
        return this.executeCurrencyConversion(parameters);

      default:
        return `Tool "${toolName}" is not available.`;
    }
  }

  /**
   * Executes product search with validated parameters
   */
  private async executeProductSearch(
    params: Record<string, unknown>,
  ): Promise<unknown> {
    const searchQuery =
      typeof params.query === 'string' ? params.query : String(params.query);

    return await searchProducts(searchQuery);
  }

  /**
   * Executes currency conversion with validated parameters
   */
  private async executeCurrencyConversion(
    params: Record<string, unknown>,
  ): Promise<unknown> {
    const amountValue =
      typeof params.amount === 'number'
        ? params.amount
        : Number(params.amount || 0);

    const sourceCurrency =
      typeof params.fromCurrency === 'string'
        ? params.fromCurrency
        : String(params.fromCurrency);

    const targetCurrency =
      typeof params.toCurrency === 'string'
        ? params.toCurrency
        : String(params.toCurrency);

    return await convertCurrencies(amountValue, sourceCurrency, targetCurrency);
  }
}
