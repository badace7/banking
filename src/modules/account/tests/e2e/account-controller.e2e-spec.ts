import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AccountModule } from '../../account.module';
import {
  CreateTestContainer,
  TestContainersType,
} from '../../../shared/configs/test-containers.config';
import { TestDatabaseModule } from '../../../shared/configs/test-database.module';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { RessourceOwnerGuard } from 'src/libs/guards/ressource-owner.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('Banking Controller (e2e)', () => {
  let app: INestApplication;
  let container: TestContainersType;
  const fakeToken = 'Bearer fake-token';

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule.forRoot(container),
        EventEmitterModule.forRoot(),
        AccountModule,
      ],
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

  it('get balance (GET)', async () => {
    await request(app.getHttpServer())
      .get('/account/balance/12312312312')
      .set('Authorization', fakeToken)
      .expect(HttpStatus.OK);
  });

  it('withdraw (POST)', async () => {
    await request(app.getHttpServer())
      .post('/account/withdraw/')
      .set('Authorization', fakeToken)
      .send({ amount: 100, origin: '12312312312' })
      .expect(HttpStatus.CREATED);
  });

  it('deposit (POST)', async () => {
    await request(app.getHttpServer())
      .post('/account/deposit/')
      .set('Authorization', fakeToken)
      .send({ amount: 100, origin: '12312312312' })
      .expect(HttpStatus.CREATED);
  });

  it('transfer (POST)', async () => {
    await request(app.getHttpServer())
      .post('/account/transfer/')
      .set('Authorization', fakeToken)
      .send({
        label: 'Test',
        amount: 100,
        origin: '12312312312',
        destination: '98797897897',
      })
      .expect(HttpStatus.CREATED);
  });
});
