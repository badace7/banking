import { Test, TestingModule } from '@nestjs/testing';

import { AccountBuilder } from '../builders/account.builder';
import {
  CreateTestContainer,
  TestContainersType,
} from '../configs/test-containers.config';
import { TestDatabaseModule } from '../configs/test-database.module';
import { createEntityManagerProvider } from 'src/config/postgres.config';
import { AccountPostgresAdapter } from '../../adapters/secondary/postgres/account.postgres.adapter';

describe('account adapter', () => {
  let container: TestContainersType;
  let accountAdapter: AccountPostgresAdapter;

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(container)],
      providers: [AccountPostgresAdapter, createEntityManagerProvider],
    }).compile();

    accountAdapter = moduleFixture.get<AccountPostgresAdapter>(
      AccountPostgresAdapter,
    );
  });

  afterAll(async () => {
    await container.stop();
  });

  test('findBankAccount() should find an account', async () => {
    const account = AccountBuilder()
      .withId('2')
      .withAccountNumber('12312312312')
      .withBalance(1000)
      .withOverDraftFacility(500)
      .ownerId('2')
      .build();

    const result = await accountAdapter.findBankAccount(account.data.number);
    expect(result).toEqual(account);
  });

  test('updateBankAccount() should update an account', async () => {
    const account = AccountBuilder()
      .withId('2')
      .withAccountNumber('12312312312')
      .withBalance(1000)
      .withOverDraftFacility(null)
      .ownerId('2')
      .build();

    const isAccountUpdated = await accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );
    expect(isAccountUpdated).toBe(true);
  });

  test('findAccountByUserId() should find user account by his id', async () => {
    const account = AccountBuilder()
      .withId('2')
      .withAccountNumber('12312312312')
      .withBalance(1000)
      .withOverDraftFacility(null)
      .ownerId('2')
      .build();

    const result = await accountAdapter.findAccountByUserId(account.data.id);

    expect(result).toEqual(account);
  });
});
