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
    const res = await request(app.getHttpServer())
      .post('/agent')

      .send({ query: 'I am looking for a phone' })

      .expect(200);

    expect(res.body).toHaveProperty('response');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof res.body.response).toBe('string');
  });

  afterAll(async () => {
    await app.close();
  });
});
