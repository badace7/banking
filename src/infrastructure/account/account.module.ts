import { Module } from '@nestjs/common';
import { AccountController } from 'src/infrastructure/account/http/account.controller';
import { MoneyTransferUsecase } from '../../domain/account/usecases/commandhandlers/moneytransfer.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { TransferEntity } from '../transaction/transfer.entity';
import { AccountRepository } from './repositories/account.repository';
import { TransferRepository } from '../transaction/transfer.repository';
import { CustomerEntity } from '../customer/customer.entity';

export const usecasesToInject = [MoneyTransferUsecase];
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
