import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DATE_PORT } from './core/_ports/repositories/date-provider.iport';
import { DEPOSIT_PORT } from './core/_ports/usecases/deposit.iport';

import { Deposit } from './core/commands/deposit.command-handler';
import { MoneyTransfer } from './core/commands/moneytransfer.command-handler';
import { Withdraw } from './core/commands/withdraw.command-handler';

import { GET_BALANCE_PORT } from './core/_ports/usecases/get-balance.iport';
import { GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT } from './core/_ports/usecases/get-operations-by-account-number.iport';
import { MONEY_TRANSFER_PORT } from './core/_ports/usecases/money-transfer.iport';
import { WITHDRAW_PORT } from './core/_ports/usecases/withdraw.iport';
import { GetBalance } from './core/queries/get-balance.usecase';
import { GetOperationsByAccountNumber } from './core/queries/get-operations-by-account-number.usecase';

import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { OPERATION_PORT } from '../operation/core/_ports/operation.iport';

import { EventPublisher } from '../shared/event-publisher';
import { createInjectableProvider } from '../shared/provider.factory';
import { EVENT_PUBLISHER_PORT } from './core/_ports/repositories/event-publisher.iport';
import { DateProvider } from '../operation/adapters/date-provider.adapter';
import { FlowIndicatorEntity } from '../operation/adapters/flow-indicator.entity';
import { OperationTypeEntity } from '../operation/adapters/operation-type.entity';
import { OperationEntity } from '../operation/adapters/operation.entity';
import { OperationPostgresAdapter } from '../operation/adapters/operation.postgres.adapter';
import { AccountEntity } from './adapters/secondary/entities/account.entity';
import { AccountPostgresAdapter } from './adapters/secondary/postgres/account.postgres.adapter';
import { BankingController } from './adapters/primary/banking.controller';
import { ACCOUNT_PORT } from './core/_ports/repositories/account.iport';
import { CREATE_ACCOUNT_PORT } from './core/_ports/usecases/create-account-when-user-is-created.iport';
import { CreateAccountWhenUserIsCreated } from './core/events/create-account-when-user-is-created.event-handler';

export const respositories = [
  {
    provide: EVENT_PUBLISHER_PORT,
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
  createInjectableProvider(
    CREATE_ACCOUNT_PORT,
    CreateAccountWhenUserIsCreated,
    [ACCOUNT_PORT],
  ),
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
