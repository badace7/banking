import { Module } from '@nestjs/common';

import { BankingCli } from './banking.cli';
import { DatabaseModule } from 'src/config/database.module';
import { CustomConsoleLogger } from './custom.console.logger';
import { CustomPrompt } from './custom.prompt';
import { AccountModule } from 'src/modules/account/account.module';

@Module({
  imports: [DatabaseModule, AccountModule],
  providers: [CustomPrompt, CustomConsoleLogger, BankingCli],
})
export class CliModule {}
