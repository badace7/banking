import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountRepository } from './repositories/account.repository';
import { TransferRepository } from '../transaction/transfer.repository';
import { TransferEntity } from '../transaction/transfer.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { AccountController } from './http/account.controller';
import { MoneyTransfer } from 'src/core/account/application/commands/moneytransfer.usecase';

export const usecasesToInject = [MoneyTransfer];
const fakeOutputPortDI = [
  { provide: 'IAccountRepository', useClass: AccountRepository },
  { provide: 'ITransactionRepository', useClass: TransferRepository },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AccountEntity, CustomerEntity, TransferEntity]),
  ],
  exports: [TypeOrmModule],
  controllers: [AccountController],
  providers: [...usecasesToInject, ...fakeOutputPortDI],
})
export class AccountModule {}
