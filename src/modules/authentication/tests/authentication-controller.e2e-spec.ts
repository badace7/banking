import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthenticationModule } from '../authentication.module';
import {
  TestContainersType,
  CreateTestContainer,
} from 'src/modules/shared/configs/test-containers.config';
import { TestDatabaseModule } from 'src/modules/shared/configs/test-database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let container: TestContainersType;
  let credentials: { identifier: string; password: string };

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule.forRoot(container),
        EventEmitterModule.forRoot(),
        AuthenticationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  describe('success case', () => {
    test('create user (POST)', async () => {
      const user = {
        firstName: 'Jacky',
        lastName: 'Brown',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/create-user/')
        .send(user)
        .expect(HttpStatus.CREATED);

      credentials = response.body;
      expect(response.body.identifier).toBeDefined();
      expect(response.body.password).toBeDefined();
      expect(typeof response.body.identifier).toBe('string');
      expect(typeof response.body.password).toBe('string');
    });

    test('login (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login/')
        .send(credentials)
        .expect(HttpStatus.OK);

      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});
