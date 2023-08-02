import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingCli } from 'src/cli/banking.cli';
import { UserEntity } from '../../authentication/infra/customer/customer.entity';
import { Deposit } from '../application/commands/deposit.usecase';
import { MoneyTransfer } from '../application/commands/moneytransfer.usecase';
import { Withdraw } from '../application/commands/withdraw.usecase';
import { AccountEntity } from './driven/account.entity';
import { AccountPostgresAdapter } from './driven/account.postgres.adapter';
import { DateProvider } from './driven/date-provider.adapter';
import { FlowIndicatorEntity } from './driven/flow-indicator.entity';
import { OperationTypeEntity } from './driven/operation-type.entity';
import { OperationEntity } from './driven/operation.entity';
import { OperationPostgresAdapter } from './driven/operation.postgres.adapter';
import { BankingController } from './driver/banking.controller';

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
      UserEntity,
      OperationEntity,
      OperationTypeEntity,
      FlowIndicatorEntity,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [BankingController],
  providers: [...usecasesToInject, ...OutputPortDI, BankingCli],
})
export class BankingModule {}
