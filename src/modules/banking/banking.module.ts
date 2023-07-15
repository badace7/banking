import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './infra/account.entity';
import { AccountPostgresAdapter } from './infra/account.postgres.adapter';
import { CustomerEntity } from '../authentication/infra/customer/customer.entity';
import { BankingController } from './apps/banking.controller';
import { MoneyTransfer } from './application/commands/moneytransfer.usecase';

export const usecasesToInject = [MoneyTransfer];
const fakeOutputPortDI = [
  { provide: 'IAccountPort', useClass: AccountPostgresAdapter },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AccountEntity, CustomerEntity]),
  ],
  exports: [TypeOrmModule],
  controllers: [BankingController],
  providers: [...usecasesToInject, ...fakeOutputPortDI],
})
export class BankingModule {}
