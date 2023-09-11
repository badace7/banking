import { EntityManager } from 'typeorm';

import { OperationBuilder } from '../builders/operation.builder';
import {
  CreateTestContainer,
  TestContainersType,
} from '../../../shared/configs/test-containers.config';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from '../../../shared/configs/test-database.module';
import { createEntityManagerProvider } from 'src/config/postgres.config';
import { OperationEntity } from 'src/modules/operation/_write/adapters/operation.entity';
import { OperationMapper } from 'src/modules/operation/_write/adapters/operation.mapper';
import { OperationPostgresAdapter } from 'src/modules/operation/_write/adapters/operation.postgres.adapter';
import { FlowIndicator } from 'src/modules/operation/_write/core/domain/flow-indicator';
import {
  OperationTypeEnum,
  FlowIndicatorEnum,
} from 'src/modules/operation/_write/core/domain/operation';
import { OperationType } from 'src/modules/operation/_write/core/domain/operation-type';

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
      .withType(OperationTypeEnum.TRANSFER)
      .withFlow(FlowIndicatorEnum.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();
    await operationAdapter.save(operation);

    const entity = await connection.getRepository(OperationEntity).findOne({
      where: { id: operation.data.id },
      relations: ['operationType', 'flowIndicator'],
    });

    const expectedOperation = OperationMapper.toDomain(entity);
    expect(expectedOperation).toEqual(operation);
  });

  test('getAllByAccountNumber() should return all account operations', async () => {
    const operation1 = OperationBuilder()
      .withId('transfer-id-1')
      .withAccountId('2')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationTypeEnum.TRANSFER)
      .withFlow(FlowIndicatorEnum.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();

    const operation2 = OperationBuilder()
      .withId('transfer-id-2')
      .withAccountId('2')
      .withLabel("Participation in Anna's gift")
      .withAmount(1000)
      .withType(OperationTypeEnum.TRANSFER)
      .withFlow(FlowIndicatorEnum.DEBIT)
      .withDate(new Date('2023-07-14T22:00:00.000Z'))
      .build();

    await Promise.all([
      operationAdapter.save(operation1),
      operationAdapter.save(operation2),
    ]);

    const results = await operationAdapter.getAllByAccountNumber('12312312312');

    expect(results).toEqual([operation1, operation2]);
  });

  test('getFlowIndicatorById() should return flow indicator', async () => {
    const flowId = 1;

    const flowIndicator = await operationAdapter.getFlowIndicatorById(flowId);

    expect(flowIndicator).toEqual(new FlowIndicator(flowId, 'DEBIT'));
  });

  test('getOperationTypeById() should return operation type', async () => {
    const operationTypeId = 1;

    const operationType = await operationAdapter.getOperationTypeById(
      operationTypeId,
    );

    expect(operationType).toEqual(
      new OperationType(operationTypeId, 'WITHDRAW'),
    );
  });
});
