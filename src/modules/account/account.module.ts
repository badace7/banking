import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DATE_PORT } from './application/_ports/repositories/date-provider.iport';
import { DEPOSIT_PORT } from './application/_ports/usecases/deposit.iport';

import { Deposit } from './application/commands/deposit.usecase';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';
import { Withdraw } from './application/commands/withdraw.usecase';
import { AccountEntity } from './infra/driven/entities/account.entity';
import { AccountPostgresAdapter } from './infra/driven/postgres/account.postgres.adapter';
import { DateProvider } from './infra/driven/providers/date-provider.adapter';

import { BankingController } from './infra/driver/banking.controller';
import { ACCOUNT_PORT } from './application/_ports/repositories/account.iport';

import { MONEY_TRANSFER_PORT } from './application/_ports/usecases/money-transfer.iport';
import { WITHDRAW_PORT } from './application/_ports/usecases/withdraw.iport';
import { GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT } from './application/_ports/usecases/get-operations-by-account-number.iport';
import { GetOperationsByAccountNumber } from './application/queries/get-operations-by-account-number.usecase';
import { GET_BALANCE_PORT } from './application/_ports/usecases/get-balance.iport';
import { GetBalance } from './application/queries/get-balance.usecase';

import { EventPublisher } from '../shared/event-publisher';
import { EVENT_PUBLISHER_PORT } from './application/_ports/event-publisher.iport';
import { OPERATION_PORT } from '../operation/application/_ports/operation.iport';
import { FlowIndicatorEntity } from '../operation/infra/flow-indicator.entity';
import { OperationTypeEntity } from '../operation/infra/operation-type.entity';
import { OperationEntity } from '../operation/infra/operation.entity';
import { OperationPostgresAdapter } from '../operation/infra/operation.postgres.adapter';
import { createInjectableProvider } from '../shared/provider.factory';

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

const PORTS = [ACCOUNT_PORT, EVENT_PUBLISHER_PORT];

export const usecases = [
  createInjectableProvider(MONEY_TRANSFER_PORT, MoneyTransfer, PORTS),
  createInjectableProvider(WITHDRAW_PORT, Withdraw, PORTS),
  createInjectableProvider(DEPOSIT_PORT, Deposit, PORTS),
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
export class AccountModule {}
