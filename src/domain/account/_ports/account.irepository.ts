import AccountDomain from '../account.domain';

export interface IAccountRepository {
  findBankAccount(accountNumber: string): Promise<AccountDomain>;
}
