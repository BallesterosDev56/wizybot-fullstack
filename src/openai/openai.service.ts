import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const ASSISTANT_SYSTEM_PROMPT =
  'You are WizyBot, an intelligent shopping assistant specialized in helping users find products and convert currencies.\n\n' +
  'Available tools:\n' +
  '• searchProducts: Search the catalog to find products and their prices\n' +
  '• convertCurrencies: Convert a specific amount from one currency to another\n\n' +
  'Important Guidelines:\n' +
  '- When users ask about a product price in a specific currency (e.g., "what is the price of the iPhone in euros", "how much is the laptop in GBP"):\n' +
  '  1. ALWAYS use searchProducts first to get the product details and current price\n' +
  '  2. After getting search results with the price and currency, you can inform the user or use convertCurrencies\n' +
  '- searchProducts is required whenever the user mentions any product name (watch, phone, laptop, dress, etc.) without providing a specific price\n' +
  '- convertCurrencies requires exact parameters: amount, fromCurrency, and toCurrency\n' +
  '- If a product has a price range (e.g., "350.0 - 365.0 USD"), you can convert both values or use the average\n' +
  '- Be helpful, friendly, and provide clear information with relevant details';

@Injectable()
export class OpenaiService {
  private readonly aiClient: OpenAI;
  private readonly modelVersion = 'gpt-3.5-turbo';

  constructor() {
    this.aiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Sends a query to OpenAI with function calling capabilities enabled
   *
   * The AI will analyze the query and decide whether to use available tools
   * (product search or currency conversion) to fulfill the request.
   *
   * @param userQuery - Natural language query from the user
   * @returns OpenAI message object, potentially containing tool calls
   */
  async askWithToolCalling(
    userQuery: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const availableTools = this.getToolDefinitions();

    const completionResponse = await this.aiClient.chat.completions.create({
      model: this.modelVersion,
      messages: [
        {
          role: 'system',
          content: ASSISTANT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
      tools: availableTools,
      tool_choice: 'auto',
    });

    return completionResponse.choices[0].message;
  }

  /**
   * Completes the conversation by sending tool results back to OpenAI
   *
   * After a tool executes, this method provides the results to the AI
   * so it can generate a natural language response for the user.
   *
   * @param originalQuery - The user's original query
   * @param executedTool - The tool call that was executed
   * @param toolOutput - Results from the tool execution
   * @returns Final AI-generated response message
   */
  async completeToolResult(
    originalQuery: string,
    executedTool: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    toolOutput: unknown,
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const completionResponse = await this.aiClient.chat.completions.create({
      model: this.modelVersion,
      messages: [
        {
          role: 'system',
          content: ASSISTANT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: originalQuery,
        },
        {
          role: 'assistant',
          tool_calls: [executedTool],
        },
        {
          role: 'tool',
          tool_call_id: executedTool.id,
          content: JSON.stringify(toolOutput),
        },
      ],
    });

    return completionResponse.choices[0].message;
  }

  /**
   * Defines available tools (functions) for the AI to use
   */
  private getToolDefinitions(): OpenAI.Chat.Completions.ChatCompletionTool[] {
    return [
      {
        type: 'function',
        function: {
          name: 'searchProducts',
          description:
            'Searches the product catalog for items matching a text query. ' +
            'Returns relevant products with details including title, description, price, images, and links.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description:
                  'Search terms describing what the user wants. Examples: "smartphone", "wireless headphones", "laptop for gaming", "birthday gift for mom"',
              },
            },
            required: ['query'],
            additionalProperties: false,
          },
          strict: true,
        },
      },
      {
        type: 'function',
        function: {
          name: 'convertCurrencies',
          description:
            'Converts a monetary amount from one currency to another using current exchange rates. ' +
            'Supports all major world currencies using ISO 4217 codes. ' +
            'If the user asks to convert a product price but does not specify the amount or source currency, ' +
            'you should first use searchProducts to find the product details, then use this function.',
          parameters: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'Numeric amount to convert (e.g., 100, 250.50)',
              },
              fromCurrency: {
                type: 'string',
                description:
                  'Source currency as 3-letter ISO code (USD, EUR, GBP, JPY, CAD, AUD, etc.)',
              },
              toCurrency: {
                type: 'string',
                description:
                  'Target currency as 3-letter ISO code (USD, EUR, GBP, JPY, CAD, AUD, etc.)',
              },
            },
            required: ['amount', 'fromCurrency', 'toCurrency'],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    ];
  }
}
