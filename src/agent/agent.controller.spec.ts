import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { UserQueryDto } from './dto/user-query.dto';

describe('AgentController', () => {
  let controller: AgentController;
  let mockAgentService: Partial<AgentService>;

  beforeEach(async () => {
    mockAgentService = {
      handleQuery: jest.fn().mockResolvedValue('Mocked assistant response'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: AgentService,
          useValue: mockAgentService,
        },
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return response from AgentService', async () => {
    const queryDto: UserQueryDto = { query: 'Tell me a joke' };

    const result = await controller.processUserQuery(queryDto);

    expect(result).toEqual({ response: 'Mocked assistant response' });
    expect(mockAgentService.handleQuery).toHaveBeenCalledWith('Tell me a joke');
  });
});
