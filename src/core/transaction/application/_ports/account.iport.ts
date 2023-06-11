import Account from '../../domain/account';

export interface IAccountPort {
  findBankAccount(accountNumber: string): Promise<Account>;
  saveBankAccount(account: Account): Promise<void>;
  updateBankAccount(accountId: string, account: Account): Promise<Account>;
}
