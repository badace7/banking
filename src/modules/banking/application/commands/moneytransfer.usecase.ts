import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { MoneyTransferCommand } from './transfer.command';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IOperationPort } from '../_ports/operation.iport';
import { Operation, OperationType } from '../../domain/operation';
import { IDateProvider } from '../_ports/date-provider.iport';
import Account from '../../domain/account';

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

    sourceAccount.debit(command.amount);
    destinationAccount.credit(command.amount);

    await this.updateAccount(sourceAccount);
    await this.updateAccount(destinationAccount);

    const operation = Operation.create({
      id: command.id,
      label: command.label,
      amount: command.amount,
      origin: command.origin,
      destination: command.destination,
      type: OperationType.TRANSFER,
      date: this.dateProvider.getNow(),
    });

    await this.operationAdapter.save(operation);
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
