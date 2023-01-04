import { Module } from '@nestjs/common';
import FakeAccountRepository from '../../infrastructure/repository/account/fakebanking.repository';
import { AccountController } from '../../infrastructure/http/account/banking.controller';
import { MoneyTransferUsecase } from '../../usecases/MoneyTransfer.usecase';
import FakeCustomerRepository from '../../infrastructure/repository/customer/fakecustomer.repository';

const accountUsecasesToInject = [MoneyTransferUsecase];

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    ...accountUsecasesToInject,
    { provide: 'IAccountRepository', useClass: FakeAccountRepository },
    { provide: 'ICustomerRepository', useClass: FakeCustomerRepository },
  ],
})
export class AccountModule {}
