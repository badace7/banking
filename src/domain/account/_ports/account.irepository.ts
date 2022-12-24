import AccountDomain from '../domain/account.domain';

export interface IAccountRepository {
  findBankAccount(accountNumber: string): Promise<AccountDomain>;
  saveBankAccount(account: AccountDomain): Promise<void>;
  updateBankAccount(accountId: string, account: AccountDomain): Promise<void>;
}
