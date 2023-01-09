import { Module } from '@nestjs/common';
import FakeAccountRepository from '../../infrastructure/fakeRepositories/account/fakebanking.repository';
import { AccountController } from 'src/infrastructure/http/transaction/transaction.controller';
import { MoneyTransferUsecase } from '../../domain/account/usecases/moneytransfer.usecase';
import FakeTransactionRepository from 'src/infrastructure/fakeRepositories/transaction/fakeTransaction.repository';

const usecasesToInject = [MoneyTransferUsecase];
const outputPortDI = [
  { provide: 'IAccountRepository', useClass: FakeAccountRepository },
  { provide: 'ITransactionRepository', useClass: FakeTransactionRepository },
];
const inputPortDI = [
  { provide: 'ITransferRequest', useClass: MoneyTransferUsecase },
];

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [...usecasesToInject, ...outputPortDI, ...inputPortDI],
})
export class AccountModule {}
