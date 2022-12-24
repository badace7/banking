import { UsecaseError } from '../../../core/helpers/usecase.error';
import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '../_ports/account.irepository';
import { ICustomerRepository } from '../../customer/_ports/customer.irepository';
import { ITransactionRepository } from '../../transaction/_ports/transaction.irepository';
import AccountDomain from '../domain/account.domain';
import CustomerDomain from 'src/domain/customer/domain/customer.domain';
import TransferTransactionDomain from '../../transaction/domain/transaction.domain';

@Injectable()
export class MoneyTransferUsecase {
  constructor(
    @Inject('IAccountRepository') private AccountRepository: IAccountRepository,
    @Inject('ICustomerRepository')
    private CustomerRepository: ICustomerRepository,
    @Inject('ITransactionRepository')
    private TransactionRepository: ITransactionRepository,
  ) {}
  async execute(transferTransaction: TransferTransactionDomain): Promise<any> {
    const accountOriginOfTransfer =
      await this.getAccountOriginOfTransferOrError(
        transferTransaction.getFrom(),
      );

    const accountAtReceptionOfTransfer =
      await this.getAccountAtReceptionOfTransferOrError(
        transferTransaction.getTo(),
      );

    accountOriginOfTransfer.debitAmount(transferTransaction.getAmount());
    accountAtReceptionOfTransfer.creditAmount(transferTransaction.getAmount());

    await this.updateAccountsAfterTransaction(
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
    );

    this.TransactionRepository.saveTransaction(transferTransaction);

    const customerAtReception = this.getCustomerAtReceptionOfTransferOrError(
      transferTransaction.getTo(),
    );

    return `You have successfully transfered ${transferTransaction.getAmount()}€ to ${(
      await customerAtReception
    ).getFirstName()}`;
  }

  async getAccountOriginOfTransferOrError(
    accountNumber: string,
  ): Promise<AccountDomain> {
    const isAccountOriginOfTransferFound =
      await this.AccountRepository.findBankAccount(accountNumber);

    if (!isAccountOriginOfTransferFound) {
      throw new UsecaseError(
        404,
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
        404,
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
        404,
        'The user at the reception of the transfer was not found.',
      );
    }
    return isCustomerAtReceptionOfTransferFound;
  }

  async updateAccountsAfterTransaction(
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
}
