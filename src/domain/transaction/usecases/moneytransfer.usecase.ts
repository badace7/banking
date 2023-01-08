import { Inject, Injectable } from '@nestjs/common';
import { ITransferRequest } from '../_ports/input/transfer.irequest';
import { ITransactionRepository } from '../_ports/output/transaction.irepository';
import TransferTransactionDomain from '../entities/transaction.domain';
import { IAccountRepository } from 'src/domain/account/_ports/account.irepository';
import AccountDomain from 'src/domain/account/entities/account.domain';
import { UsecaseError } from 'src/core/exceptions/usecase.error';

@Injectable()
export class MoneyTransferUsecase implements ITransferRequest {
  constructor(
    @Inject('IAccountRepository') private AccountRepository: IAccountRepository,
    @Inject('ITransactionRepository')
    private TransactionRepository: ITransactionRepository,
  ) {}
  async execute(transferTransaction: TransferTransactionDomain): Promise<void> {
    const accountAtOrigin = await this.getAccountOriginOfTransfer(
      transferTransaction.getFrom(),
    );

    const accountAtReception = await this.getAccountAtReceptionOfTransfer(
      transferTransaction.getTo(),
    );

    await this.makeTransferBetweenAccounts(
      accountAtOrigin,
      accountAtReception,
      transferTransaction.getAmount(),
    );

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

  async makeTransferBetweenAccounts(
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
    amount: number,
  ): Promise<void> {
    accountOriginOfTransfer.debitAmount(amount);
    accountAtReceptionOfTransfer.creditAmount(amount);

    await this.saveAccountsChanges(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
    );
  }
  async saveTransferTransaction(
    transferTransaction: TransferTransactionDomain,
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
