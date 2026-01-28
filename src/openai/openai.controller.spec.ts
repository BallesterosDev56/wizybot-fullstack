import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';

describe('OpenaiController', () => {
  let controller: OpenaiController;
  let service: OpenaiService;

  beforeEach(async () => {
    const mockOpenaiService = {
      askWithToolCalling: jest.fn(),
      completeToolResult: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenaiController],
      providers: [
        {
          provide: OpenaiService,
          useValue: mockOpenaiService,
        },
      ],
    }).compile();

    controller = module.get<OpenaiController>(OpenaiController);
    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have access to OpenaiService', () => {
    expect(service).toBeDefined();
  });
});
