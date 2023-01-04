import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/account/_ports/account.irepository';
import { ITransactionRepository } from '../domain/transaction/_ports/transaction.irepository';
import AccountDomain from '../domain/account/entities/account.domain';
import TransferTransactionDomain from '../domain/transaction/entities/transaction.domain';
import { Result } from '../core/exceptions/result';

@Injectable()
export class MoneyTransferUsecase {
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

    const transferTransactionCompletedOrError =
      transferTransaction.makeTransfer(
        accountOriginOfTransfer,
        accountAtReceptionOfTransfer,
      );

    if (transferTransactionCompletedOrError.isFailure) {
      return Result.fail<void>(transferTransactionCompletedOrError.error);
    }

    const transferTransactionCompleted: AccountDomain[] =
      transferTransactionCompletedOrError.getValue();

    await this.updateAccountsAfterTransfer(transferTransactionCompleted);

    await this.TransactionRepository.saveTransaction(transferTransaction);
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

  async updateAccountsAfterTransfer(
    accountsAfterTransfer: AccountDomain[],
  ): Promise<void> {
    for (const account of accountsAfterTransfer) {
      await this.AccountRepository.updateBankAccount(
        account.getNumber(),
        account,
      );
    }
  }
}
