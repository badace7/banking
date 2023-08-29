import { Module } from '@nestjs/common';
import { BankingModule } from './modules/banking/banking.module';
import { DatabaseModule } from './config/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [DatabaseModule, BankingModule, AuthenticationModule],
})
export class AppModule {}
