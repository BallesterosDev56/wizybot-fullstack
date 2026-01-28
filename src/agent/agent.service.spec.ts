import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from './agent.service';
import { OpenaiService } from '../openai/openai.service';
import * as tools from './tools/search-products';

describe('AgentService', () => {
  let service: AgentService;
  let mockOpenaiService: Partial<OpenaiService>;

  beforeEach(async () => {
    // Mock OpenAI tool call response
    mockOpenaiService = {
      askWithToolCalling: jest.fn().mockResolvedValue({
        tool_calls: [
          {
            id: 'call_1',
            function: {
              name: 'searchProducts',
              arguments: JSON.stringify({ query: 'phone' }),
            },
          },
        ],
      }),
      completeToolResult: jest.fn().mockResolvedValue({
        content: 'Mocked final assistant response',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: OpenaiService,
          useValue: mockOpenaiService,
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle a tool_call to searchProducts and return final response', async () => {
    // Mock the tool function used by the service
    jest.spyOn(tools, 'searchProducts').mockResolvedValue([
      {
        title: 'iPhone 13',
        price: '1099',
        category: 'smartphones',
        description: 'Latest Apple iPhone',
        imageUrl: 'https://example.com/iphone-13.jpg',
        url: 'https://example.com/iphone-13',
      },
    ]);

    const result = await service.handleQuery('I am looking for a phone');

    expect(result).toBe('Mocked final assistant response');
    expect(mockOpenaiService.askWithToolCalling).toHaveBeenCalledWith(
      'I am looking for a phone',
    );
    expect(mockOpenaiService.completeToolResult).toHaveBeenCalledWith(
      'I am looking for a phone',
      expect.any(Object),
      [
        {
          title: 'iPhone 13',
          price: '1099',
          category: 'smartphones',
          description: 'Latest Apple iPhone',
          imageUrl: 'https://example.com/iphone-13.jpg',
          url: 'https://example.com/iphone-13',
        },
      ],
    );
  });

  it('should return plain message if no tool_calls', async () => {
    (mockOpenaiService.askWithToolCalling as jest.Mock).mockResolvedValue({
      content: 'Just answering directly.',
      tool_calls: undefined,
    });

    const result = await service.handleQuery('Hello!');
    expect(result).toBe('Just answering directly.');
  });

  it('should return message for unknown tool', async () => {
    (mockOpenaiService.askWithToolCalling as jest.Mock).mockResolvedValue({
      tool_calls: [
        {
          id: 'call_2',
          function: {
            name: 'unknownTool',
            arguments: '{}',
          },
        },
      ],
    });

    const result = await service.handleQuery('Use a tool please');
    expect(result).toBe('Tool "unknownTool" is not available.');
  });

  it('should throw error if tool arguments are malformed JSON', async () => {
    (mockOpenaiService.askWithToolCalling as jest.Mock).mockResolvedValue({
      tool_calls: [
        {
          id: 'call_3',
          function: {
            name: 'searchProducts',
            arguments: 'not-json',
          },
        },
      ],
    });

    await expect(service.handleQuery('Break the parser')).rejects.toThrow(
      'Malformed tool arguments from AI response.',
    );
  });
});
