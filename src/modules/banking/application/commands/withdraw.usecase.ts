import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { WithdrawCommand } from './withdraw.command';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';
import { IOperationPort } from '../_ports/operation.iport';
import { IDateProvider } from '../_ports/date-provider.iport';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(WithdrawCommand)
export class Withdraw implements ICommandHandler<WithdrawCommand> {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IOperationPort') private operationAdapter: IOperationPort,
    @Inject('IDateProvider') private dateProvider: IDateProvider,
  ) {}
  async execute(command: WithdrawCommand): Promise<void> {
    const account = await this.getAccount(command.origin);

    account.debit(command.amount);

    this.saveAccountChanges(account);

    const operation = Operation.create({
      id: command.id,
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
      account.data.number,
      account,
    );

    if (!isAccountUpdated) {
      throw new UsecaseError(
        `Cannot update the account ${account.data.number}`,
      );
    }
  }
}
