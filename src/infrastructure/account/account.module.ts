import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './output/account.entity';
import { AccountPostgresAdapter } from './output/account.postgres.adapter';
import { EventStoreDBAdapter } from '../transaction/output/eventstoredb.adapter';
import { CustomerEntity } from '../customer/customer.entity';
import { AccountController } from './input/account.controller';
import { MoneyTransfer } from 'src/core/account/application/commands/moneytransfer.usecase';

export const usecasesToInject = [MoneyTransfer];
const fakeOutputPortDI = [
  { provide: 'IAccountPort', useClass: AccountPostgresAdapter },
  { provide: 'IEventPort', useClass: EventStoreDBAdapter },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AccountEntity, CustomerEntity]),
  ],
  exports: [TypeOrmModule],
  controllers: [AccountController],
  providers: [...usecasesToInject, ...fakeOutputPortDI],
})
export class AccountModule {}
