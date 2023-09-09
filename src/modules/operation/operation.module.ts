import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OPERATION_PORT } from './core/_ports/operation.iport';

import { CreateOperationWhenDepositIsDone } from './core/create-operation-when-deposit-is-done.event-handler';
import { CREATE_DEPOSIT_OPERATION_PORT } from './core/_ports/create-operation-when-deposit-is-done.iport';
import { DATE_PORT } from './core/_ports/date-provider.iport';
import { CREATE_WITHDRAW_OPERATION_PORT } from './core/_ports/create-operation-when-withdraw-is-done.iport';
import { CreateOperationWhenWithdrawIsDone } from './core/create-operation-when-withdraw-is-done.event-handler';
import { CreateOperationWhenTransferIsDone } from './core/create-operation-when-transfer-is-done.event-handler';
import { CREATE_TRANSFER_OPERATION_PORT } from './core/_ports/create-operation-when-transfer-is-done';
import { createInjectableProvider } from '../shared/provider.factory';
import { DateProvider } from './adapters/date-provider.adapter';
import { FlowIndicatorEntity } from './adapters/flow-indicator.entity';
import { OperationTypeEntity } from './adapters/operation-type.entity';
import { OperationEntity } from './adapters/operation.entity';
import { OperationPostgresAdapter } from './adapters/operation.postgres.adapter';

const repositories = [
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
  providers: [...usecases, ...repositories, TypeOrmModule],
})
export class OperationModule {}
