import { Module } from '@nestjs/common';
import { BankingModule } from './modules/banking/banking.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [DatabaseModule, BankingModule],
})
export class AppModule {}
