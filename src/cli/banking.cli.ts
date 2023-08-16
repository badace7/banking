import { Inject } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import {
  DEPOSIT_PORT,
  IDeposit,
} from 'src/modules/banking/application/_ports/usecases/deposit.iport';
import {
  IMoneyTransfer,
  MONEY_TRANSFER_PORT,
} from 'src/modules/banking/application/_ports/usecases/money-transfer.iport';
import {
  IWithdraw,
  WITHDRAW_PORT,
} from 'src/modules/banking/application/_ports/usecases/withdraw.iport';
import { DepositCommand } from 'src/modules/banking/application/commands/deposit.command';
import { MoneyTransferCommand } from 'src/modules/banking/application/commands/transfer.command';
import { WithdrawCommand } from 'src/modules/banking/application/commands/withdraw.command';
import { v4 as uuidv4 } from 'uuid';
import { CustomConsoleLogger } from './custom.console.logger';
import { CustomPrompt } from './custom.prompt';
import {
  FIND_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IFindOperationByAccountNumber,
} from 'src/modules/banking/application/_ports/usecases/find-operations-by-account-number.iport';
import { FindOperationsByNumberQuery } from 'src/modules/banking/application/queries/find-operations-by-account-number.query';

@Command({
  name: 'banking',
  options: { isDefault: true },
})
export class BankingCli extends CommandRunner {
  constructor(
    @Inject(MONEY_TRANSFER_PORT)
    private readonly moneyTransferUsecase: IMoneyTransfer,
    @Inject(WITHDRAW_PORT)
    private readonly withdrawUsecase: IWithdraw,
    @Inject(DEPOSIT_PORT)
    private readonly depositUsecase: IDeposit,
    @Inject(FIND_OPERATIONS_BY_ACCOUNT_NUMBER_PORT)
    private readonly findOperationsByAccountNumberUsecase: IFindOperationByAccountNumber,
    private readonly logger: CustomConsoleLogger,
    private readonly prompt: CustomPrompt,
  ) {
    super();
  }
  async run(): Promise<void> {
    try {
      this.logger.displayLogo();
      const choice = await this.prompt.operationsPrompt();
      await this.execOperationByChoice(choice);
    } catch (error: any) {
      this.logger.displayError(error.message);
      process.exit(1);
    }
  }

  private async execOperationByChoice(choice: string) {
    if (choice === 'transfer') {
      const { origin, destination, amount, label } =
        await this.prompt.transferPrompt();

      const command = new MoneyTransferCommand(
        uuidv4(),
        label,
        parseInt(amount),
        origin,
        destination,
      );

      await this.moneyTransferUsecase.execute(command);
      this.logger.displaySuccess('Transfer was successful');
      process.exit(0);
    }

    if (choice === 'deposit') {
      const { origin, amount } = await this.prompt.depositPrompt();
      const command = new DepositCommand(uuidv4(), origin, parseInt(amount));

      await this.depositUsecase.execute(command);
      this.logger.displaySuccess('Deposit was successful');
      process.exit(0);
    }

    if (choice === 'withdraw') {
      const { origin, amount } = await this.prompt.withdrawPrompt();
      const command = new WithdrawCommand(uuidv4(), origin, parseInt(amount));

      await this.withdrawUsecase.execute(command);
      this.logger.displaySuccess('Withdraw was successful');
      process.exit(0);
    }

    if (choice === 'view-operations') {
      const accountNumber = await this.prompt.viewOperationsPrompt();
      const operations =
        await this.findOperationsByAccountNumberUsecase.execute(
          new FindOperationsByNumberQuery(accountNumber),
        );
      this.logger.displayOperationsView(operations);
      process.exit(0);
    }

    if (choice === 'cancel') {
      this.logger.displaySuccess('Ok, bye');
      process.exit(0);
    }
  }
}
