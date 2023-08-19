import { EntityManager } from 'typeorm';
import { FlowIndicator, OperationType } from '../../domain/operation';
import { OperationEntity } from '../../infra/driven/entities/operation.entity';
import { OperationMapper } from '../../infra/driven/mappers/operation.mapper';
import { OperationPostgresAdapter } from '../../infra/driven/postgres/operation.postgres.adapter';
import { OperationBuilder } from '../builders/operation.builder';
import {
  CreateTestContainer,
  TestContainersType,
} from '../configs/test-containers.config';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from '../configs/test-database.module';
import { createEntityManagerProvider } from 'src/config/postgres.config';

describe('operation adapter', () => {
  let container: TestContainersType;
  let connection: EntityManager;
  let operationAdapter: OperationPostgresAdapter;

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(container)],
      providers: [OperationPostgresAdapter, createEntityManagerProvider],
    }).compile();

    connection = moduleFixture.get<EntityManager>(EntityManager);

    operationAdapter = moduleFixture.get<OperationPostgresAdapter>(
      OperationPostgresAdapter,
    );
  });

  afterAll(async () => {
    await container.stop();
  });

  test('save() should save an operation', async () => {
    const operation = OperationBuilder()
      .withId('transfer-id-1')
      .withAccountId('2')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationType.TRANSFER)
      .withFlow(FlowIndicator.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();
    await operationAdapter.save(operation);

    const entity = await connection
      .getRepository(OperationEntity)
      .findOne({ where: { id: operation.data.id } });

    const expectedOperation = OperationMapper.toDomain(entity);
    expect(expectedOperation).toEqual(operation);
  });

  test('getAllByAccountNumber() should return all account operations', async () => {
    const operation1 = OperationBuilder()
      .withId('transfer-id-1')
      .withAccountId('2')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationType.TRANSFER)
      .withFlow(FlowIndicator.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();

    const operation2 = OperationBuilder()
      .withId('transfer-id-2')
      .withAccountId('2')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationType.TRANSFER)
      .withFlow(FlowIndicator.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();

    await Promise.all([
      operationAdapter.save(operation1),
      operationAdapter.save(operation2),
    ]);

    const results = await operationAdapter.getAllByAccountNumber('12312312312');

    expect(results).toEqual([operation1, operation2]);
  });
});
