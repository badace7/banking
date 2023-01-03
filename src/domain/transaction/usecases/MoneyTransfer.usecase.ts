import { UsecaseError } from '../../../libs/exceptions/usecase.error';
import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../../account/_ports/account.irepository';
import { ICustomerRepository } from '../../customer/_ports/customer.irepository';
import { ITransactionRepository } from '../_ports/transaction.irepository';
import AccountDomain from '../../account/entities/account.domain';
import CustomerDomain from 'src/domain/customer/entities/customer.domain';
import TransferTransactionDomain from '../entities/transaction.domain';

@Injectable()
export class MoneyTransferUsecase {
  constructor(
    @Inject('IAccountRepository') private AccountRepository: IAccountRepository,
    @Inject('ICustomerRepository')
    private CustomerRepository: ICustomerRepository,
    @Inject('ITransactionRepository')
    private TransactionRepository: ITransactionRepository,
  ) {}
  async execute(
    transferTransaction: TransferTransactionDomain,
  ): Promise<string> {
    const accountOriginOfTransfer =
      await this.getAccountOriginOfTransferOrError(
        transferTransaction.getFrom(),
      );

    const accountAtReceptionOfTransfer =
      await this.getAccountAtReceptionOfTransferOrError(
        transferTransaction.getTo(),
      );

    await this.makeTransferBetweenAccounts(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
      transferTransaction.getAmount(),
    );

    this.TransactionRepository.saveTransaction(transferTransaction);

    const customerAtReception =
      await this.getCustomerAtReceptionOfTransferOrError(
        transferTransaction.getTo(),
      );

    return `You have successfully transfered ${transferTransaction.getAmount()}€ to ${customerAtReception.getFirstName()}`;
  }

  async getAccountOriginOfTransferOrError(
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

  async getAccountAtReceptionOfTransferOrError(
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

  async getCustomerAtReceptionOfTransferOrError(
    accountNumber: string,
  ): Promise<CustomerDomain> {
    const isCustomerAtReceptionOfTransferFound =
      await this.CustomerRepository.findCustomerByAccountNumber(accountNumber);

    if (!isCustomerAtReceptionOfTransferFound) {
      throw new UsecaseError(
        'The user at the reception of the transfer was not found.',
      );
    }
    return isCustomerAtReceptionOfTransferFound;
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
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
    amount: number,
  ): Promise<void> {
    accountOriginOfTransfer.debitAmount(amount);
    accountAtReceptionOfTransfer.creditAmount(amount);

    await this.updateAccountsAfterTransfer(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
    );
  }
}
