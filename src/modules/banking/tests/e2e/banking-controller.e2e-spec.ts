import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BankingModule } from '../../banking.module';
import {
  CreateTestContainer,
  TestContainersType,
} from '../configs/test-containers.config';
import { TestDatabaseModule } from '../configs/test-database.module';

describe('Banking Controller (e2e)', () => {
  let app: INestApplication;
  let container: TestContainersType;

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(container), BankingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  it('get operations (GET)', async () => {
    await request(app.getHttpServer())
      .get('/banking/account/operations/12312312312')
      .expect(HttpStatus.OK);
  });

  it('get balance (GET)', async () => {
    await request(app.getHttpServer())
      .get('/banking/account/balance/12312312312')
      .expect(HttpStatus.OK);
  });

  it('withdraw (POST)', async () => {
    await request(app.getHttpServer())
      .post('/banking/account/operation/withdraw/')
      .send({ amount: 100, origin: '12312312312' })
      .expect(HttpStatus.CREATED);
  });

  it('deposit (POST)', async () => {
    await request(app.getHttpServer())
      .post('/banking/account/operation/deposit/')
      .send({ amount: 100, origin: '12312312312' })
      .expect(HttpStatus.CREATED);
  });

  it('transfer (POST)', async () => {
    await request(app.getHttpServer())
      .post('/banking/account/operation/transfer/')
      .send({
        label: 'Test',
        amount: 100,
        origin: '12312312312',
        destination: '98797897897',
      })
      .expect(HttpStatus.CREATED);
  });
});
