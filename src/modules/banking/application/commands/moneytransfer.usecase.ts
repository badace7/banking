import { NotFound, Unprocessable } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';

import { IDateProvider } from '../_ports/repositories/date-provider.iport';

import { MoneyTransferCommand } from './transfer.command';
import { IMoneyTransfer } from '../_ports/usecases/money-transfer.iport';
import { IAccountPort } from '../_ports/repositories/account.iport';
import { IOperationPort } from '../_ports/repositories/operation.iport';
import { ErrorMessage } from 'src/libs/exceptions/message-error';

export class MoneyTransfer implements IMoneyTransfer {
  constructor(
    private accountAdapter: IAccountPort,
    private operationAdapter: IOperationPort,
    private dateProvider: IDateProvider,
  ) {}

  async execute(command: MoneyTransferCommand): Promise<void> {
    if (command.origin === command.destination) {
      throw new Unprocessable(
        ErrorMessage.SOURCE_AND_DESTINATION_ACCOUNTS_CANNOT_BE_THE_SAME,
      );
    }

    const sourceAccount = await this.getAccount(command.origin);
    const destinationAccount = await this.getAccount(command.destination);

    const sourceOperation = Operation.create({
      id: `${command.id}-1`,
      label: command.label,
      amount: command.amount,
      account: sourceAccount.data.id,
      type: OperationType.TRANSFER,
      flow: FlowIndicator.DEBIT,
      date: this.dateProvider.getNow(),
    });

    const destinationOperation = Operation.create({
      id: `${command.id}-2`,
      label: command.label,
      amount: command.amount,
      account: destinationAccount.data.id,
      type: OperationType.TRANSFER,
      flow: FlowIndicator.CREDIT,
      date: this.dateProvider.getNow(),
    });

    sourceAccount.debit(sourceOperation.data.amount);
    destinationAccount.credit(sourceOperation.data.amount);

    await Promise.all([
      this.updateAccount(sourceAccount),
      this.updateAccount(destinationAccount),
      this.operationAdapter.save(sourceOperation),
      this.operationAdapter.save(destinationOperation),
    ]);
  }

  private async getAccount(accountNumber: string): Promise<Account> {
    const account = await this.accountAdapter.findBankAccount(accountNumber);

    if (!account) {
      throw new NotFound(
        `${ErrorMessage.ACCOUNT_IS_NOT_FOUND} n° ${accountNumber}`,
      );
    }
    return account;
  }

  private async updateAccount(account: Account) {
    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );

    if (!isAccountUpdated) {
      throw new Error(`Cannot update the account ${account.data.number}`);
    }
  }
}
