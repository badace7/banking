import { WithdrawCommand } from './withdraw.command';
import { NotFound, Unprocessable } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';
import { IDateProvider } from '../_ports/repositories/date-provider.iport';
import { IAccountPort } from '../_ports/repositories/account.iport';
import { IOperationPort } from '../_ports/repositories/operation.iport';
import { ErrorMessage } from 'src/libs/exceptions/message-error';

export class Withdraw {
  constructor(
    private accountAdapter: IAccountPort,
    private operationAdapter: IOperationPort,
    private dateProvider: IDateProvider,
  ) {}
  async execute(command: WithdrawCommand): Promise<void> {
    if (command.amount < 10) {
      throw new Unprocessable(ErrorMessage.CANNOT_WITHDRAW_UNDER_10);
    }
    const account = await this.getAccount(command.origin);

    account.debit(command.amount);

    await this.saveAccountChanges(account);

    const operation = Operation.create({
      id: `${command.id}-1`,
      label: 'Withdraw',
      amount: command.amount,
      account: account.data.id,
      type: OperationType.WITHDRAW,
      flow: FlowIndicator.DEBIT,
      date: this.dateProvider.getNow(),
    });

    await this.operationAdapter.save(operation);
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

  private async saveAccountChanges(account: Account) {
    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );

    if (!isAccountUpdated) {
      throw new Error(`Cannot update the account ${account.data.number}`);
    }
  }
}
