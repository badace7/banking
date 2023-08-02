import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';
import { IAccountPort } from '../_ports/account.iport';
import { IDateProvider } from '../_ports/date-provider.iport';
import { IOperationPort } from '../_ports/operation.iport';
import { MoneyTransferCommand } from './transfer.command';

@CommandHandler(MoneyTransferCommand)
export class MoneyTransfer implements ICommandHandler<MoneyTransferCommand> {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IOperationPort') private operationAdapter: IOperationPort,
    @Inject('IDateProvider') private dateProvider: IDateProvider,
  ) {}

  async execute(command: MoneyTransferCommand): Promise<void> {
    const sourceAccount = await this.getAccount(command.origin);
    const destinationAccount = await this.getAccount(command.destination);

    const sourceOperation = Operation.create({
      id: command.id,
      label: command.label,
      amount: command.amount,
      account: command.origin,
      type: OperationType.TRANSFER,
      flow: FlowIndicator.DEBIT,
      date: this.dateProvider.getNow(),
    });

    const destinationOperation = Operation.create({
      id: command.id,
      label: command.label,
      amount: command.amount,
      account: command.destination,
      type: OperationType.TRANSFER,
      flow: FlowIndicator.CREDIT,
      date: this.dateProvider.getNow(),
    });

    sourceAccount.debit(sourceOperation.data.amount);
    destinationAccount.credit(sourceOperation.data.amount);

    await this.updateAccount(sourceAccount);
    await this.updateAccount(destinationAccount);

    await this.operationAdapter.save(sourceOperation);
    await this.operationAdapter.save(destinationOperation);
  }

  private async getAccount(accountNumber: string): Promise<Account> {
    const account = await this.accountAdapter.findBankAccount(accountNumber);

    if (!account) {
      throw new UsecaseError(`Account ${accountNumber} not found.`);
    }
    return account;
  }

  private async updateAccount(account: Account) {
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
