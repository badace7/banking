import { Module } from '@nestjs/common';
import { BankingModule } from 'src/modules/banking/banking.module';
import { BankingCli } from './banking.cli';
import { DatabaseModule } from 'src/config/database.module';
import { CustomConsoleLogger } from './custom.console.logger';
import { CustomPrompt } from './custom.prompt';

@Module({
  imports: [DatabaseModule, BankingModule],
  providers: [CustomPrompt, CustomConsoleLogger, BankingCli],
})
export class CliModule {}
