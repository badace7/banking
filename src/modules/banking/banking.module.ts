import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingCli } from 'src/cli/banking.cli';
import { UserEntity } from '../authentication/infra/customer/customer.entity';
import { Deposit } from './application/commands/deposit.usecase';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';
import { Withdraw } from './application/commands/withdraw.usecase';
import { AccountEntity } from './infra/driven/account.entity';
import { FlowIndicatorEntity } from './infra/driven/flow-indicator.entity';
import { OperationTypeEntity } from './infra/driven/operation-type.entity';
import { OperationEntity } from './infra/driven/operation.entity';
import { BankingController } from './infra/driver/banking.controller';
import { ACCOUNT_PORT } from './application/_ports/account.iport';
import { OPERATION_PORT } from './application/_ports/operation.iport';
import { DATE_PORT } from './application/_ports/date-provider.iport';
import { AccountPostgresAdapter } from './infra/driven/account.postgres.adapter';
import { OperationPostgresAdapter } from './infra/driven/operation.postgres.adapter';
import { DateProvider } from './infra/driven/date-provider.adapter';
import { createInjectableProvider } from 'src/provider.factory';

const respositories = [
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

const usecases = [
  createInjectableProvider(MoneyTransfer, PORTS),
  createInjectableProvider(Withdraw, PORTS),
  createInjectableProvider(Deposit, PORTS),
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
  providers: [...usecases, ...respositories, BankingCli],
  exports: [TypeOrmModule],
})
export class BankingModule {}
