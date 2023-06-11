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
    const accountAtOrigin = await this.getAccountOriginOfTransfer(command.from);

    const accountAtReception = await this.getAccountAtReceptionOfTransfer(
      command.to,
    );

    const transferTransaction = TransferTransaction.create(command);

    accountAtOrigin.setTransactionToPerform(transferTransaction);

    accountAtOrigin.transferTo(accountAtReception);

    await this.saveAccountsChanges(accountAtOrigin, accountAtReception);
  }

  private async getAccountOriginOfTransfer(
    accountNumber: string,
  ): Promise<Account> {
    const isAccountOriginOfTransferFound =
      await this.accountAdapter.findBankAccount(accountNumber);

    if (!isAccountOriginOfTransferFound) {
      throw new UsecaseError(
        'The account from which the transfer originated was not found.',
      );
    }
    return isAccountOriginOfTransferFound;
  }

  private async getAccountAtReceptionOfTransfer(
    accountNumber: string,
  ): Promise<Account> {
    const isAccountAtReceptionOfTransferFound =
      await this.accountAdapter.findBankAccount(accountNumber);

    if (!isAccountAtReceptionOfTransferFound) {
      throw new UsecaseError(
        'The account at the reception of the transfer was not found.',
      );
    }
    return isAccountAtReceptionOfTransferFound;
  }

  private async saveAccountsChanges(
    accountOriginOfTransfer: Account,
    accountAtReceptionOfTransfer: Account,
  ): Promise<void> {
    const isAccountOriginOfTransferUpdated =
      await this.accountAdapter.updateBankAccount(
        accountOriginOfTransfer.data.number,
        accountOriginOfTransfer,
      );

    if (!isAccountOriginOfTransferUpdated) {
      throw new UsecaseError('Cannot update the account at origin of transfer');
    }

    await this.eventStoreAdapter.save(
      accountOriginOfTransfer.getDomainEvents(),
      accountOriginOfTransfer.getId(),
    );

    const isAccountAtReceptionOfTransferUpdated =
      await this.accountAdapter.updateBankAccount(
        accountAtReceptionOfTransfer.data.number,
        accountAtReceptionOfTransfer,
      );

    if (!isAccountAtReceptionOfTransferUpdated) {
      throw new UsecaseError(
        'Cannot update the account at reception of transfer',
      );
    }

    await this.eventStoreAdapter.save(
      accountAtReceptionOfTransfer.getDomainEvents(),
      accountAtReceptionOfTransfer.getId(),
    );
  }
}
