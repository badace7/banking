import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createInjectableProvider } from '../shared/provider.factory';
import { DateProvider } from './_write/adapters/date-provider.adapter';
import { FlowIndicatorEntity } from './_write/adapters/flow-indicator.entity';
import { OperationTypeEntity } from './_write/adapters/operation-type.entity';
import { OperationEntity } from './_write/adapters/operation.entity';
import { OperationPostgresAdapter } from './_write/adapters/operation.postgres.adapter';
import { CREATE_DEPOSIT_OPERATION_PORT } from './_write/core/_ports/create-operation-when-deposit-is-done.iport';
import { CREATE_TRANSFER_OPERATION_PORT } from './_write/core/_ports/create-operation-when-transfer-is-done';
import { CREATE_WITHDRAW_OPERATION_PORT } from './_write/core/_ports/create-operation-when-withdraw-is-done.iport';
import { DATE_PORT } from './_write/core/_ports/date-provider.iport';
import { OPERATION_PORT } from './_write/core/_ports/operation.iport';
import { CreateOperationWhenDepositIsDone } from './_write/core/create-operation-when-deposit-is-done.event-handler';
import { CreateOperationWhenTransferIsDone } from './_write/core/create-operation-when-transfer-is-done.event-handler';
import { CreateOperationWhenWithdrawIsDone } from './_write/core/create-operation-when-withdraw-is-done.event-handler';
import { OperationReadController } from './_read/adapters/operation-read.controller';
import { GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT } from './_read/core/get-operations-by-account-number.iport';

import { EntityManagerProvider } from 'src/config/postgres.config';
import { GetOperationsByAccountNumber } from './_read/core/get-operations-by-account-number.query-handler';

const repositories = [
  EntityManagerProvider,
  {
    provide: OPERATION_PORT,
    useClass: OperationPostgresAdapter,
  },
  {
    provide: DATE_PORT,
    useClass: DateProvider,
  },
];

const usecases = [
  createInjectableProvider(
    CREATE_DEPOSIT_OPERATION_PORT,
    CreateOperationWhenDepositIsDone,
    [OPERATION_PORT, DATE_PORT],
  ),
  createInjectableProvider(
    CREATE_WITHDRAW_OPERATION_PORT,
    CreateOperationWhenWithdrawIsDone,
    [OPERATION_PORT, DATE_PORT],
  ),

  createInjectableProvider(
    CREATE_TRANSFER_OPERATION_PORT,
    CreateOperationWhenTransferIsDone,
    [OPERATION_PORT, DATE_PORT],
  ),

  createInjectableProvider(
    GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
    GetOperationsByAccountNumber,
    ['DATABASE_CONNECTION', DATE_PORT],
  ),
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OperationEntity,
      OperationTypeEntity,
      FlowIndicatorEntity,
    ]),
    EventEmitterModule,
  ],
  controllers: [OperationReadController],
  providers: [...usecases, ...repositories, TypeOrmModule],
})
export class OperationModule {}
