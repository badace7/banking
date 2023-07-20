import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infra/account.entity';
import { AccountPostgresAdapter } from './infra/account.postgres.adapter';
import { BankingController } from './apps/banking.controller';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';
import { OperationPostgresAdapter } from './infra/operation.postgres.adapter';
import { DateProvider } from './infra/date-provider.adapter';
import { Withdraw } from './application/commands/withdraw.usecase';
import { Deposit } from './application/commands/deposit.usecase';
import { OperationEntity } from './infra/operation.entity';
import { OperationTypeEntity } from './infra/operation-type.entity';
import { CustomerEntity } from '../authentication/infra/customer/customer.entity';

export const usecasesToInject = [MoneyTransfer, Withdraw, Deposit];
const fakeOutputPortDI = [
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
  providers: [...usecasesToInject, ...fakeOutputPortDI],
})
export class BankingModule {}
