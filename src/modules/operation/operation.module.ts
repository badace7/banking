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
