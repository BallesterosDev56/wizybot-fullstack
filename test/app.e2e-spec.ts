import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AgentController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/agent (POST) should return assistant response', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const res = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .post('/agent')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .send({ query: 'I am looking for a phone' })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body).toHaveProperty('response');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof res.body.response).toBe('string');
  });

  afterAll(async () => {
    await app.close();
  });
});
