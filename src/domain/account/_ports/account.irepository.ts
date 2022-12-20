import AccountDomain from '../domain/account.domain';

export interface IAccountRepository {
  findBankAccount(accountNumber: string): Promise<AccountDomain>;
}
