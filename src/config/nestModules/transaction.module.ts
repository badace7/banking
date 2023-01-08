import { Module } from '@nestjs/common';
import FakeAccountRepository from '../../infrastructure/fakeRepositories/account/fakebanking.repository';
import { TransactionController } from '../../infrastructure/http/account/banking.controller';
import { MoneyTransferUsecase } from '../../domain/transaction/usecases/moneytransfer.usecase';
import FakeTransactionRepository from 'src/infrastructure/fakeRepositories/transaction/fakeTransaction.repository';

const transactionUsecasesToInject = [MoneyTransferUsecase];
const outputPortDI = [
  { provide: 'IAccountRepository', useClass: FakeAccountRepository },
  { provide: 'ITransactionRepository', useClass: FakeTransactionRepository },
];
const inputPortDI = [
  { provide: 'ITransferRequest', useClass: MoneyTransferUsecase },
];

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [...transactionUsecasesToInject, ...outputPortDI, ...inputPortDI],
})
export class TransactionModule {}
