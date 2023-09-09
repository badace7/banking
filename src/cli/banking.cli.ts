import { Inject } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import {
  DEPOSIT_PORT,
  IDeposit,
} from 'src/modules/account/core/_ports/usecases/deposit.iport';
import {
  GET_BALANCE_PORT,
  IGetBalance,
} from 'src/modules/account/core/_ports/usecases/get-balance.iport';
import {
  GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IGetOperationByAccountNumber,
} from 'src/modules/account/core/_ports/usecases/get-operations-by-account-number.iport';
import {
  MONEY_TRANSFER_PORT,
  IMoneyTransfer,
} from 'src/modules/account/core/_ports/usecases/money-transfer.iport';
import {
  WITHDRAW_PORT,
  IWithdraw,
} from 'src/modules/account/core/_ports/usecases/withdraw.iport';
import { DepositCommand } from 'src/modules/account/core/commands/deposit.command';
import { MoneyTransferCommand } from 'src/modules/account/core/commands/transfer.command';
import { WithdrawCommand } from 'src/modules/account/core/commands/withdraw.command';
import { GetBalanceQuery } from 'src/modules/account/core/queries/get-balance.query';
import { GetOperationsByNumberQuery } from 'src/modules/account/core/queries/get-operations-by-account-number.query';
import { CustomConsoleLogger } from './custom.console.logger';
import { CustomPrompt } from './custom.prompt';
import { v4 as uuidv4 } from 'uuid';

enum Choice {
  transfer = 'transfer',
  deposit = 'deposit',
  withdraw = 'withdraw',
  view_operations = 'view-operations',
  view_balance = 'view-balance',
}

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
    @Inject(GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT)
    private readonly findOperationsByAccountNumberUsecase: IGetOperationByAccountNumber,
    @Inject(GET_BALANCE_PORT)
    private readonly getBalanceUsecase: IGetBalance,
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
    if (choice === Choice.transfer) {
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

    if (choice === Choice.deposit) {
      const { origin, amount } = await this.prompt.depositPrompt();
      const command = new DepositCommand(uuidv4(), origin, parseInt(amount));

      await this.depositUsecase.execute(command);
      this.logger.displaySuccess('Deposit was successful');
      process.exit(0);
    }

    if (choice === Choice.withdraw) {
      const { origin, amount } = await this.prompt.withdrawPrompt();
      const command = new WithdrawCommand(uuidv4(), origin, parseInt(amount));

      await this.withdrawUsecase.execute(command);
      this.logger.displaySuccess('Withdraw was successful');
      process.exit(0);
    }

    if (choice === Choice.view_operations) {
      const accountNumber = await this.prompt.getAccountNumberPrompt();
      const operations =
        await this.findOperationsByAccountNumberUsecase.execute(
          new GetOperationsByNumberQuery(accountNumber),
        );
      this.logger.displayDataInTable(
        operations.map((operation) => operation.data),
        ['date', 'label', 'debit', 'credit'],
      );
      process.exit(0);
    }

    if (choice === Choice.view_balance) {
      const accountNumber = await await this.prompt.getAccountNumberPrompt();
      const balanceData = await this.getBalanceUsecase.execute(
        new GetBalanceQuery(accountNumber),
      );

      this.logger.displayMessage('This is your account balance : \n');

      this.logger.displayMessage(
        'Account number : ' +
          balanceData.data.accountNumber +
          '\n' +
          ' Balance : ' +
          balanceData.data.balance +
          '\n' +
          ' Date : ' +
          balanceData.data.date,
      );

      this.logger.displayMessage('------------------------------');
      process.exit(0);
    }

    if (choice === 'cancel') {
      this.logger.displaySuccess('Ok, bye');
      process.exit(0);
    }
  }
}
