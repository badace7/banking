import { Inject, Injectable } from '@nestjs/common';
import { ITransferRequest } from '../_ports/input/transfer.irequest';
import { ITransactionRepository } from '../_ports/output/transaction.irepository';
import TransferTransactionDomain from '../entities/transaction.domain';
import { IAccountRepository } from 'src/domain/account/_ports/account.irepository';
import AccountDomain from 'src/domain/account/entities/account.domain';
import { Result } from 'src/core/exceptions/result';

@Injectable()
export class MoneyTransferUsecase implements ITransferRequest {
  constructor(
    @Inject('IAccountRepository') private AccountRepository: IAccountRepository,
    @Inject('ITransactionRepository')
    private TransactionRepository: ITransactionRepository,
  ) {}
  async execute(
    transferTransaction: TransferTransactionDomain,
  ): Promise<Result<void>> {
    const accountOriginOfTransferOrError =
      await this.getAccountOriginOfTransferOrError(
        transferTransaction.getFrom(),
      );

    const accountAtReceptionOfTransferOrError =
      await this.getAccountAtReceptionOfTransferOrError(
        transferTransaction.getTo(),
      );

    const gettingAccounts = Result.combine([
      accountOriginOfTransferOrError,
      accountAtReceptionOfTransferOrError,
    ]);

    if (gettingAccounts.isFailure) {
      return Result.fail<void>(gettingAccounts.error);
    }

    const accountOriginOfTransfer = accountOriginOfTransferOrError.getValue();
    const accountAtReceptionOfTransfer =
      accountAtReceptionOfTransferOrError.getValue();

    const transferCompletedOrError = await this.makeTransferBetweenAccounts(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
      transferTransaction.getAmount(),
    );

    if (transferCompletedOrError.isFailure) {
      return Result.fail<void>(transferCompletedOrError.error);
    }
    const transactionSavedOrError = await this.saveTransactionAfterTransfer(
      transferTransaction,
    );

    if (transactionSavedOrError.isFailure) {
      return Result.fail<void>(transactionSavedOrError.error);
    }

    return Result.ok<void>();
  }

  async getAccountOriginOfTransferOrError(
    accountNumber: string,
  ): Promise<Result<AccountDomain>> {
    const isAccountOriginOfTransferFound =
      await this.AccountRepository.findBankAccount(accountNumber);

    if (!isAccountOriginOfTransferFound) {
      return Result.fail<AccountDomain>(
        'The account from which the transfer originated was not found.',
      );
    }
    return Result.ok<AccountDomain>(isAccountOriginOfTransferFound);
  }

  async getAccountAtReceptionOfTransferOrError(
    accountNumber: string,
  ): Promise<Result<AccountDomain>> {
    const isAccountAtReceptionOfTransferFound =
      await this.AccountRepository.findBankAccount(accountNumber);

    if (!isAccountAtReceptionOfTransferFound) {
      return Result.fail<AccountDomain>(
        'The account at the reception of the transfer was not found.',
      );
    }
    return Result.ok<AccountDomain>(isAccountAtReceptionOfTransferFound);
  }

  async makeTransferBetweenAccounts(
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
    amount: number,
  ): Promise<Result<void>> {
    const debitOriginAccountOrError =
      accountOriginOfTransfer.debitAmount(amount);

    if (debitOriginAccountOrError.isFailure) {
      return Result.fail<void>(debitOriginAccountOrError.error);
    }

    accountAtReceptionOfTransfer.creditAmount(amount);

    const accountHaveBeenUpdated = await this.updateAccountsAfterTransfer(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
    );

    if (accountHaveBeenUpdated.isFailure) {
      return Result.fail<void>(accountHaveBeenUpdated.error);
    }

    return Result.ok<void>();
  }
  async saveTransactionAfterTransfer(
    transferTransaction: TransferTransactionDomain,
  ): Promise<Result<void>> {
    const isTransactionSaved = await this.TransactionRepository.saveTransaction(
      transferTransaction,
    );

    if (!isTransactionSaved) {
      return Result.fail<void>(
        'Something gone wrong, we failed to save the transaction.',
      );
    }

    return Result.ok<void>();
  }
  async updateAccountsAfterTransfer(
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
  ): Promise<Result<void>> {
    const isAccountOriginOfTransferUpdated =
      await this.AccountRepository.updateBankAccount(
        accountOriginOfTransfer.getNumber(),
        accountOriginOfTransfer,
      );

    if (!isAccountOriginOfTransferUpdated) {
      return Result.fail<void>(
        'Cannot update the account at origin of transfer',
      );
    }

    const isAccountAtReceptionOfTransferUpdated =
      await this.AccountRepository.updateBankAccount(
        accountAtReceptionOfTransfer.getNumber(),
        accountAtReceptionOfTransfer,
      );

    if (!isAccountAtReceptionOfTransferUpdated) {
      return Result.fail<void>(
        'Cannot update the account at reception of transfer',
      );
    }

    return Result.ok<void>();
  }
}
