import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BankingModule } from 'src/modules/banking/banking.module';
import {
  CreateTestContainer,
  TestContainersType,
} from 'src/modules/banking/tests/configs/test-containers.config';
import { TestDatabaseModule } from 'src/modules/banking/tests/configs/test-database.module';

describe('Authentication Controller (e2e)', () => {
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

  test('true to be true', () => {
    expect(true).toBe(true);
  });
});
