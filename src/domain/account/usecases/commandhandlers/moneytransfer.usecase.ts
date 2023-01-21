import { Inject } from '@nestjs/common';
import { IAccountRepository } from '../../_ports/output/account.irepository';
import { ITransactionRepository } from '../../_ports/output/transaction.irepository';
import { CreateTransferCommand } from '../../commands/transfer.command';
import AccountDomain from '../../models/account.domain';
import TransferDomain from '../../models/transfer.domain';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateTransferCommand)
export class MoneyTransferUsecase
  implements ICommandHandler<CreateTransferCommand>
{
  constructor(
    @Inject('IAccountRepository') private AccountRepository: IAccountRepository,
    @Inject('ITransactionRepository')
    private TransactionRepository: ITransactionRepository,
  ) {}
  async execute(command: CreateTransferCommand): Promise<void> {
    const accountAtOrigin = await this.getAccountOriginOfTransfer(command.from);

    const accountAtReception = await this.getAccountAtReceptionOfTransfer(
      command.to,
    );

    accountAtOrigin.transferTo(accountAtReception, command.amount);

    await this.saveAccountsChanges(accountAtOrigin, accountAtReception);

    const transferTransaction = TransferDomain.create(command);

    await this.saveTransferTransaction(transferTransaction);
  }

  async getAccountOriginOfTransfer(
    accountNumber: string,
  ): Promise<AccountDomain> {
    const isAccountOriginOfTransferFound =
      await this.AccountRepository.findBankAccount(accountNumber);

    if (!isAccountOriginOfTransferFound) {
      throw new UsecaseError(
        'The account from which the transfer originated was not found.',
      );
    }
    return isAccountOriginOfTransferFound;
  }

  async getAccountAtReceptionOfTransfer(
    accountNumber: string,
  ): Promise<AccountDomain> {
    const isAccountAtReceptionOfTransferFound =
      await this.AccountRepository.findBankAccount(accountNumber);

    if (!isAccountAtReceptionOfTransferFound) {
      throw new UsecaseError(
        'The account at the reception of the transfer was not found.',
      );
    }
    return isAccountAtReceptionOfTransferFound;
  }

  async saveTransferTransaction(
    transferTransaction: TransferDomain,
  ): Promise<void> {
    const isTransactionSaved = await this.TransactionRepository.saveTransaction(
      transferTransaction,
    );

    if (!isTransactionSaved) {
      throw new UsecaseError(
        'Something gone wrong, we failed to save the transaction.',
      );
    }
  }
  async saveAccountsChanges(
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
  ): Promise<void> {
    const isAccountOriginOfTransferUpdated =
      await this.AccountRepository.updateBankAccount(
        accountOriginOfTransfer.getNumber(),
        accountOriginOfTransfer,
      );

    if (!isAccountOriginOfTransferUpdated) {
      throw new UsecaseError('Cannot update the account at origin of transfer');
    }

    const isAccountAtReceptionOfTransferUpdated =
      await this.AccountRepository.updateBankAccount(
        accountAtReceptionOfTransfer.getNumber(),
        accountAtReceptionOfTransfer,
      );

    if (!isAccountAtReceptionOfTransferUpdated) {
      throw new UsecaseError(
        'Cannot update the account at reception of transfer',
      );
    }
  }
}
