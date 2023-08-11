import { WithdrawCommand } from './withdraw.command';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';
import { IDateProvider } from '../_ports/driven/date-provider.iport';
import { IAccountPort } from '../_ports/driven/account.iport';
import { IOperationPort } from '../_ports/driven/operation.iport';

export class Withdraw {
  constructor(
    private accountAdapter: IAccountPort,
    private operationAdapter: IOperationPort,
    private dateProvider: IDateProvider,
  ) {}
  async execute(command: WithdrawCommand): Promise<void> {
    const account = await this.getAccount(command.origin);

    account.debit(command.amount);

    await this.saveAccountChanges(account);

    const operation = Operation.create({
      id: `${command.id}-1`,
      label: 'Withdraw',
      amount: command.amount,
      account: command.origin,
      type: OperationType.WITHDRAW,
      flow: FlowIndicator.DEBIT,
      date: this.dateProvider.getNow(),
    });

    await this.operationAdapter.save(operation);
  }

  private async getAccount(accountNumber: string): Promise<Account> {
    const account = await this.accountAdapter.findBankAccount(accountNumber);

    if (!account) {
      throw new UsecaseError(`The account ${accountNumber} not found.`);
    }
    return account;
  }

  private async saveAccountChanges(account: Account) {
    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );

    if (!isAccountUpdated) {
      throw new UsecaseError(
        `Cannot update the account ${account.data.number}`,
      );
    }
  }
}
