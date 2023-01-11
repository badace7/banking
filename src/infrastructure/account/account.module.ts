import { Module } from '@nestjs/common';
import { AccountController } from 'src/infrastructure/account/http/account.controller';
import { MoneyTransferUsecase } from '../../domain/account/usecases/commandhandlers/moneytransfer.usecase';
import FakeAccountRepository from './fakeRepositories/fakebanking.repository';
import FakeTransactionRepository from 'src/infrastructure/transaction/fakeTransaction.repository';
import { CqrsModule } from '@nestjs/cqrs';

export const usecasesToInject = [MoneyTransferUsecase];
const fakeOutputPortDI = [
  { provide: 'IAccountRepository', useClass: FakeAccountRepository },
  { provide: 'ITransactionRepository', useClass: FakeTransactionRepository },
];

@Module({
  imports: [CqrsModule],
  controllers: [AccountController],
  providers: [...usecasesToInject, ...fakeOutputPortDI],
})
export class AccountModule {}
