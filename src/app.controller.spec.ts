import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API status information', () => {
      const status = appController.getApiStatus();
      expect(status).toHaveProperty('message', 'WizyBot API is running');
      expect(status).toHaveProperty('version', '1.0.0');
      expect(status).toHaveProperty('status', 'healthy');
      expect(status).toHaveProperty('author', 'Daniel Ballesteros');
    });
  });
});
