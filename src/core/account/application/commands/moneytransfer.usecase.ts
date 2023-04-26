import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { IEventPort } from '../_ports/transaction.iport';
import { CreateTransferCommand } from './transfer.command';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import TransferDomain from 'src/core/account/domain/transfer.domain';
import AccountDomain from 'src/core/account/domain/account.domain';

@CommandHandler(CreateTransferCommand)
export class MoneyTransfer implements ICommandHandler<CreateTransferCommand> {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IEventPort')
    private eventStoreAdapter: IEventPort,
  ) {}
  async execute(command: CreateTransferCommand): Promise<void> {
    const accountAtOrigin = await this.getAccountOriginOfTransfer(command.from);

    const accountAtReception = await this.getAccountAtReceptionOfTransfer(
      command.to,
    );

    const transferTransaction = TransferDomain.create(command);

    accountAtOrigin.transferTo(accountAtReception, transferTransaction);

    await this.saveAccountsChanges(accountAtOrigin, accountAtReception);
  }

  private async getAccountOriginOfTransfer(
    accountNumber: string,
  ): Promise<AccountDomain> {
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
  ): Promise<AccountDomain> {
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
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
  ): Promise<void> {
    const isAccountOriginOfTransferUpdated =
      await this.accountAdapter.updateBankAccount(
        accountOriginOfTransfer.getNumber(),
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
        accountAtReceptionOfTransfer.getNumber(),
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

  // private async saveTransferEvent(transferEvent: IEvent): Promise<void> {
  //   const isTransactionSaved = await this.TransactionRepository.saveTransaction(
  //     transferTransaction,
  //   );

  //   if (!isTransactionSaved) {
  //     throw new UsecaseError(
  //       'Something gone wrong, we failed to save the transaction.',
  //     );
  //   }
  // }
}
