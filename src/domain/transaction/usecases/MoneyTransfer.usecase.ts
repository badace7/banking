import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../../account/_ports/account.irepository';
import { ITransactionRepository } from '../_ports/transaction.irepository';
import AccountDomain from '../../account/entities/account.domain';
import TransferTransactionDomain from '../entities/transaction.domain';
import { Result } from '../../../libs/exceptions/result';

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

    if (accountOriginOfTransferOrError.isFailure) {
      return Result.fail<void>(accountOriginOfTransferOrError.error);
    }

    const accountOriginOfTransfer = accountOriginOfTransferOrError.getValue();

    const accountAtReceptionOfTransferOrError =
      await this.getAccountAtReceptionOfTransferOrError(
        transferTransaction.getTo(),
      );

    if (accountAtReceptionOfTransferOrError.isFailure) {
      return Result.fail<void>(accountAtReceptionOfTransferOrError.error);
    }

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

    await this.makeTransferBetweenAccounts(transferTransactionCompleted);

    this.TransactionRepository.saveTransaction(transferTransaction);
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
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
  ): Promise<void> {
    this.AccountRepository.updateBankAccount(
      accountOriginOfTransfer.getId(),
      accountOriginOfTransfer,
    );

    this.AccountRepository.updateBankAccount(
      accountAtReceptionOfTransfer.getId(),
      accountAtReceptionOfTransfer,
    );
  }

  async makeTransferBetweenAccounts(
    transferTransactionCompleted: AccountDomain[],
  ): Promise<void> {
    const [accountOriginOfTransfer, accountAtReceptionOfTransfer] =
      transferTransactionCompleted;

    await this.updateAccountsAfterTransfer(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
    );
  }
}
