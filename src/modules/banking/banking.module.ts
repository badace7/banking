import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createInjectableProvider } from 'src/provider.factory';
import { UserEntity } from '../authentication/infra/customer/user.entity';

import { DATE_PORT } from './application/_ports/driven/date-provider.iport';
import { DEPOSIT_PORT } from './application/_ports/driver/deposit.iport';

import { Deposit } from './application/commands/deposit.usecase';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';
import { Withdraw } from './application/commands/withdraw.usecase';
import { AccountEntity } from './infra/driven/account.entity';
import { AccountPostgresAdapter } from './infra/driven/account.postgres.adapter';
import { DateProvider } from './infra/driven/date-provider.adapter';
import { FlowIndicatorEntity } from './infra/driven/flow-indicator.entity';
import { OperationTypeEntity } from './infra/driven/operation-type.entity';
import { OperationEntity } from './infra/driven/operation.entity';
import { OperationPostgresAdapter } from './infra/driven/operation.postgres.adapter';
import { BankingController } from './infra/driver/banking.controller';
import { ACCOUNT_PORT } from './application/_ports/driven/account.iport';
import { OPERATION_PORT } from './application/_ports/driven/operation.iport';
import { MONEY_TRANSFER_PORT } from './application/_ports/driver/money-transfer.iport';
import { WITHDRAW_PORT } from './application/_ports/driver/withdraw.iport';

export const respositories = [
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
  createInjectableProvider(DEPOSIT_PORT, Deposit, PORTS),
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      UserEntity,
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
