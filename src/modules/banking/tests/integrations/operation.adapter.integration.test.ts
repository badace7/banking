import { DataSource } from 'typeorm';
import { OperationEntity } from '../../infra/driven/operation.entity';
import { OperationTypeEntity } from '../../infra/driven/operation-type.entity';
import { FlowIndicatorEntity } from '../../infra/driven/flow-indicator.entity';
import { AccountEntity } from '../../infra/driven/account.entity';
import { OperationPostgresAdapter } from '../../infra/driven/operation.postgres.adapter';
import { OperationBuilder } from '../builders/operation.builder';
import { FlowIndicator, OperationType } from '../../domain/operation';
import {
  CreateTestContainer,
  TestContainersType,
} from '../configs/test-containers.config';
import { createDatabaseConnection } from '../configs/test-database.config';

describe('operation adapter', () => {
  let container: TestContainersType;
  let connection: DataSource;
  let operationAdapter: OperationPostgresAdapter;

  beforeAll(async () => {
    container = await CreateTestContainer();

    connection = createDatabaseConnection(
      container.getHost(),
      container.getMappedPort(5432),
    );

    const operationRepository = connection.getRepository(OperationEntity);
    const operationTypeRepository =
      connection.getRepository(OperationTypeEntity);
    const flowIndicatorRepository =
      connection.getRepository(FlowIndicatorEntity);
    const accountRepository = connection.getRepository(AccountEntity);

    operationAdapter = new OperationPostgresAdapter(
      operationRepository,
      operationTypeRepository,
      flowIndicatorRepository,
      accountRepository,
    );
    await connection.initialize();
  });

  afterAll(async () => {
    await connection.destroy();
    await container.stop();
  });

  test('save() should save an operation', async () => {
    const operation = OperationBuilder()
      .withId('transfer-id-1')
      .withAccount('12312312312')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationType.TRANSFER)
      .withFlow(FlowIndicator.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();
    await operationAdapter.save(operation);

    const result = await connection
      .getRepository(OperationEntity)
      .findOne({ where: { id: operation.data.id } });

    expect(result).toEqual({
      id: 'transfer-id-1',
      amount: 1000,
      label: "Participation in Anna's gift",
      date: new Date('2023-07-14T22:00:00.000Z'),
    });
  });

  test('getAllByAccountNumber() should return all account operations', async () => {
    const operation1 = OperationBuilder()
      .withId('transfer-id-1')
      .withAccount('12312312312')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationType.TRANSFER)
      .withFlow(FlowIndicator.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();

    const operation2 = OperationBuilder()
      .withId('transfer-id-2')
      .withAccount('12312312312')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationType.TRANSFER)
      .withFlow(FlowIndicator.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();

    await Promise.all([
      await operationAdapter.save(operation1),
      await operationAdapter.save(operation2),
    ]);

    const results = await operationAdapter.getAllByAccountNumber('12312312312');

    expect(results).toEqual([operation1, operation2]);
  });
});
