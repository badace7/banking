import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  CreateTestContainer,
  TestContainersType,
} from 'src/modules/banking/tests/configs/test-containers.config';
import { TestDatabaseModule } from 'src/modules/banking/tests/configs/test-database.module';
import { AuthenticationModule } from '../authentication.module';

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let container: TestContainersType;

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(container), AuthenticationModule],
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
        firstName: 'Jack',
        lastName: 'Sparrow',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/create-user/')
        .send(user)
        .expect(HttpStatus.CREATED);

      expect(response.body.identifier).toBeDefined();
      expect(response.body.password).toBeDefined();
      expect(typeof response.body.identifier).toBe('string');
      expect(typeof response.body.password).toBe('string');
    });

    test('login (POST)', async () => {
      const credentials = { identifier: '98797897897', password: '987978' };
      const response = await request(app.getHttpServer())
        .post('/auth/login/')
        .send(credentials)
        .expect(HttpStatus.OK);

      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});
