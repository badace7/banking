import { AccountPostgresAdapter } from '../../infra/driven/postgres/account.postgres.adapter';
import { AccountBuilder } from '../builders/account.builder';
import {
  CreateTestContainer,
  TestContainersType,
} from '../configs/test-containers.config';
import {
  TestingDatabase,
  createDatabaseConnection,
} from '../configs/test-database.config';

describe('account adapter', () => {
  let container: TestContainersType;
  let connection: TestingDatabase;
  let accountAdapter: AccountPostgresAdapter;

  beforeAll(async () => {
    container = await CreateTestContainer();

    connection = createDatabaseConnection(
      container.getHost(),
      container.getMappedPort(5432),
    );

    accountAdapter = new AccountPostgresAdapter(connection.manager);
    await connection.initialize();
  });

  afterAll(async () => {
    await connection.destroy();
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
});
