import { Module } from '@nestjs/common';
import FakeAccountRepository from '../../infrastructure/repository/account/fakebanking.repository';
import { AccountController } from '../../infrastructure/http/account/banking.controller';
import { MoneyTransfer } from '../../domain/account/usecases/MoneyTransfer.usecase';

const accountUsecasesToInject = [MoneyTransfer];

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    ...accountUsecasesToInject,
    { provide: 'IAccountRepository', useClass: FakeAccountRepository },
  ],
})
export class AccountModule {}
