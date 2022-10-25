import { Module } from '@nestjs/common';
import { BankingController } from './infrastructure/primary/bank/banking.controller';
import { BankingService } from './domain/usecases/banking.service';
import FakeBankingRepository from './infrastructure/secondary/bank/fakebanking.repository';

@Module({
  imports: [],
  controllers: [BankingController],
  providers: [
    BankingService,
    { provide: 'IBankingRepository', useClass: FakeBankingRepository },
    { provide: 'IBankingService', useClass: BankingService },
  ],
})
export class AppModule {}
