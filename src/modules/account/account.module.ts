import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventPublisher } from '../shared/event-publisher';
import { createInjectableProvider } from '../shared/provider.factory';

import { AccountEntity } from './_write/adapters/secondary/entities/account.entity';
import { AccountPostgresAdapter } from './_write/adapters/secondary/postgres/account.postgres.adapter';
import { EVENT_PUBLISHER_PORT } from '../authentication/core/_ports/repositories/event-publisher.iport';

import { ACCOUNT_PORT } from './_write/core/_ports/repositories/account.iport';
import { CREATE_ACCOUNT_PORT } from './_write/core/_ports/usecases/create-account-when-user-is-created.iport';
import { DEPOSIT_PORT } from './_write/core/_ports/usecases/deposit.iport';
import { GET_BALANCE_PORT } from './_read/_ports/get-balance.iport';

import { MONEY_TRANSFER_PORT } from './_write/core/_ports/usecases/money-transfer.iport';
import { WITHDRAW_PORT } from './_write/core/_ports/usecases/withdraw.iport';
import { Deposit } from './_write/core/commands/deposit.command-handler';
import { MoneyTransfer } from './_write/core/commands/moneytransfer.command-handler';
import { Withdraw } from './_write/core/commands/withdraw.command-handler';
import { CreateAccountWhenUserIsCreated } from './_write/core/events/create-account-when-user-is-created.event-handler';
import { GetBalance } from './_read/core/queries/get-balance.query-handler';
import { DATE_PORT } from './_write/core/_ports/repositories/date-provider.iport';
import { DateProvider } from '../operation/_write/adapters/date-provider.adapter';
import { FlowIndicatorEntity } from '../operation/_write/adapters/flow-indicator.entity';
import { OperationTypeEntity } from '../operation/_write/adapters/operation-type.entity';
import { OperationEntity } from '../operation/_write/adapters/operation.entity';
import { AccountWriteController } from './_write/adapters/primary/http/account-write.controller';
import { AccountReadController } from './_read/adapters/primary/http/account-read.controller';
import { EntityManagerProvider } from 'src/config/postgres.config';

const PORTS = [ACCOUNT_PORT, EVENT_PUBLISHER_PORT];

export const gateways: Provider[] = [
  EntityManagerProvider,
  {
    provide: EVENT_PUBLISHER_PORT,
    useClass: EventPublisher,
  },
  {
    provide: ACCOUNT_PORT,
    useClass: AccountPostgresAdapter,
  },
  {
    provide: DATE_PORT,
    useClass: DateProvider,
  },
];

const commandHandlers: Provider[] = [
  createInjectableProvider(MONEY_TRANSFER_PORT, MoneyTransfer, PORTS),
  createInjectableProvider(WITHDRAW_PORT, Withdraw, PORTS),
  createInjectableProvider(DEPOSIT_PORT, Deposit, PORTS),
];

const eventHandlers: Provider[] = [
  createInjectableProvider(
    CREATE_ACCOUNT_PORT,
    CreateAccountWhenUserIsCreated,
    [ACCOUNT_PORT],
  ),
];

export const queryHandlers: Provider[] = [
  createInjectableProvider(GET_BALANCE_PORT, GetBalance, [
    'DATABASE_CONNECTION',
    DATE_PORT,
  ]),
];

export const controllers = [AccountReadController, AccountWriteController];

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  controllers: [...controllers],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    ...gateways,
  ],
  exports: [...queryHandlers, ...gateways, TypeOrmModule],
})
export class AccountModule {}
