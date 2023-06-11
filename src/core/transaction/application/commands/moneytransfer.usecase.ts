import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { IEventPort } from '../_ports/transaction.iport';
import { MoneyTransferCommand } from './transfer.command';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import TransferTransaction from 'src/core/transaction/domain/transfer';
import Account from 'src/core/transaction/domain/account';

@CommandHandler(MoneyTransferCommand)
export class MoneyTransfer implements ICommandHandler<MoneyTransferCommand> {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IEventPort')
    private eventStoreAdapter: IEventPort,
  ) {}

  async handle(command: MoneyTransferCommand): Promise<void> {
    const accountAtOrigin = await this.getAccount(command.from);
    const accountAtReception = await this.getAccount(command.to);

    const transferTransaction = TransferTransaction.create(command);

    accountAtOrigin.setTransactionToPerform(transferTransaction);
    accountAtOrigin.transferTo(accountAtReception);

    await this.saveAccountChanges(accountAtOrigin);
    await this.saveAccountChanges(accountAtReception);
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

    await this.eventStoreAdapter.save(
      account.getDomainEvents(),
      account.getId(),
    );
  }
}
