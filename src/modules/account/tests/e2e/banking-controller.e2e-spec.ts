import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AccountModule } from '../../account.module';
import {
  CreateTestContainer,
  TestContainersType,
} from '../configs/test-containers.config';
import { TestDatabaseModule } from '../configs/test-database.module';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { RessourceOwnerGuard } from 'src/libs/guards/ressource-owner.guard';

describe('Banking Controller (e2e)', () => {
  let app: INestApplication;
  let container: TestContainersType;
  const fakeCookie = `Authentication=fake-token; HttpOnly; Path=/; Max-Age=1800s`;

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(container), AccountModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RessourceOwnerGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

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
      .set('set-cookie', fakeCookie)
      .expect(HttpStatus.OK);
  });

  it('get balance (GET)', async () => {
    await request(app.getHttpServer())
      .get('/banking/account/balance/12312312312')
      .set('set-cookie', fakeCookie)
      .expect(HttpStatus.OK);
  });

  it('withdraw (POST)', async () => {
    await request(app.getHttpServer())
      .post('/banking/account/operation/withdraw/')
      .set('set-cookie', fakeCookie)
      .send({ amount: 100, origin: '12312312312' })
      .expect(HttpStatus.CREATED);
  });

  it('deposit (POST)', async () => {
    await request(app.getHttpServer())
      .post('/banking/account/operation/deposit/')
      .set('set-cookie', fakeCookie)
      .send({ amount: 100, origin: '12312312312' })
      .expect(HttpStatus.CREATED);
  });

  it('transfer (POST)', async () => {
    await request(app.getHttpServer())
      .post('/banking/account/operation/transfer/')
      .set('set-cookie', fakeCookie)
      .send({
        label: 'Test',
        amount: 100,
        origin: '12312312312',
        destination: '98797897897',
      })
      .expect(HttpStatus.CREATED);
  });
});
