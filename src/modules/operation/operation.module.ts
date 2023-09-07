import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OPERATION_PORT } from './application/_ports/operation.iport';
import { DateProvider } from './infra/date-provider.adapter';
import { FlowIndicatorEntity } from './infra/flow-indicator.entity';
import { OperationTypeEntity } from './infra/operation-type.entity';
import { OperationEntity } from './infra/operation.entity';
import { OperationPostgresAdapter } from './infra/operation.postgres.adapter';
import { createInjectableProvider } from 'src/provider.factory';
import { CreateOperationWhenDepositIsDone } from './application/create-operation-when-deposit-is-done.event-handler';
import { CREATE_OPERATION_PORT } from './application/_ports/create-operation-when-deposit-is-done.iport';
import { DATE_PORT } from './application/_ports/date-provider.iport';

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
    CREATE_OPERATION_PORT,
    CreateOperationWhenDepositIsDone,
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
