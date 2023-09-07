import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createInjectableProvider } from 'src/provider.factory';

import { DATE_PORT } from './application/_ports/repositories/date-provider.iport';
import { DEPOSIT_PORT } from './application/_ports/usecases/deposit.iport';

import { Deposit } from './application/commands/deposit.usecase';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';
import { Withdraw } from './application/commands/withdraw.usecase';
import { AccountEntity } from './infra/driven/entities/account.entity';
import { AccountPostgresAdapter } from './infra/driven/postgres/account.postgres.adapter';
import { DateProvider } from './infra/driven/providers/date-provider.adapter';
import { FlowIndicatorEntity } from './infra/driven/entities/flow-indicator.entity';
import { OperationTypeEntity } from './infra/driven/entities/operation-type.entity';
import { OperationEntity } from './infra/driven/entities/operation.entity';
import { OperationPostgresAdapter } from './infra/driven/postgres/operation.postgres.adapter';
import { BankingController } from './infra/driver/banking.controller';
import { ACCOUNT_PORT } from './application/_ports/repositories/account.iport';
import { OPERATION_PORT } from './application/_ports/repositories/operation.iport';
import { MONEY_TRANSFER_PORT } from './application/_ports/usecases/money-transfer.iport';
import { WITHDRAW_PORT } from './application/_ports/usecases/withdraw.iport';
import { GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT } from './application/_ports/usecases/get-operations-by-account-number.iport';
import { GetOperationsByAccountNumber } from './application/queries/get-operations-by-account-number.usecase';
import { GET_BALANCE_PORT } from './application/_ports/usecases/get-balance.iport';
import { GetBalance } from './application/queries/get-balance.usecase';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { EventPublisher } from './infra/driven/event-publisher';
export const respositories = [
  {
    provide: 'IEventPublisher',
    useClass: EventPublisher,
  },
  {
    provide: ACCOUNT_PORT,
    useClass: AccountPostgresAdapter,
  },
  {
    provide: OPERATION_PORT,
    useClass: OperationPostgresAdapter,
  },
  {
    provide: DATE_PORT,
    useClass: DateProvider,
  },
];

const PORTS = [ACCOUNT_PORT, OPERATION_PORT, DATE_PORT];

export const usecases = [
  createInjectableProvider(MONEY_TRANSFER_PORT, MoneyTransfer, PORTS),
  createInjectableProvider(WITHDRAW_PORT, Withdraw, PORTS),
  createInjectableProvider(DEPOSIT_PORT, Deposit, [
    ...PORTS,
    'IEventPublisher',
  ]),
  createInjectableProvider(
    GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
    GetOperationsByAccountNumber,
    [OPERATION_PORT, DATE_PORT],
  ),
  createInjectableProvider(GET_BALANCE_PORT, GetBalance, [
    ACCOUNT_PORT,
    DATE_PORT,
  ]),
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      OperationEntity,
      OperationTypeEntity,
      FlowIndicatorEntity,
    ]),
  ],
  controllers: [BankingController],
  providers: [...usecases, ...respositories],
  exports: [...usecases, ...respositories, TypeOrmModule],
})
export class BankingModule {}
