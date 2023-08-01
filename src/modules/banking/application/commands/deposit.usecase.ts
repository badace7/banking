import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import { DepositCommand } from './deposit.command';
import { Operation, OperationType } from '../../domain/operation';
import { IOperationPort } from '../_ports/operation.iport';
import { IDateProvider } from '../_ports/date-provider.iport';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DepositCommand)
export class Deposit implements ICommandHandler<DepositCommand> {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IOperationPort') private operationAdapter: IOperationPort,
    @Inject('IDateProvider') private dateProvider: IDateProvider,
  ) {}
  async execute(command: DepositCommand): Promise<void> {
    const account = await this.getAccount(command.origin);

    account.credit(command.amount);

    this.saveAccountChanges(account);

    const operation = Operation.create({
      id: command.id,
      label: 'Deposit',
      amount: command.amount,
      account: command.origin,
      type: OperationType.DEPOSIT,
      date: this.dateProvider.getNow(),
    });

    this.operationAdapter.save(operation);
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
