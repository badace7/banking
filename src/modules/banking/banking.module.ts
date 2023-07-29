import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infra/driven/account.entity';
import { BankingController } from './infra/driver/banking.controller';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';
import { Withdraw } from './application/commands/withdraw.usecase';
import { Deposit } from './application/commands/deposit.usecase';
import { CustomerEntity } from '../authentication/infra/customer/customer.entity';
import { AccountPostgresAdapter } from './infra/driven/account.postgres.adapter';
import { OperationPostgresAdapter } from './infra/driven/operation.postgres.adapter';
import { DateProvider } from './infra/driven/date-provider.adapter';
import { OperationEntity } from './infra/driven/operation.entity';
import { OperationTypeEntity } from './infra/driven/operation-type.entity';
import { BankingCli } from 'src/cli/banking.cli';

export const usecasesToInject = [MoneyTransfer, Withdraw, Deposit];
const OutputPortDI = [
  { provide: 'IAccountPort', useClass: AccountPostgresAdapter },
  { provide: 'IOperationPort', useClass: OperationPostgresAdapter },
  { provide: 'IDateProvider', useClass: DateProvider },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      AccountEntity,
      CustomerEntity,
      OperationEntity,
      OperationTypeEntity,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [BankingController],
  providers: [...usecasesToInject, ...OutputPortDI, BankingCli],
})
export class BankingModule {}
