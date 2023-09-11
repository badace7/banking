import Account from 'src/modules/account/core/domain/account';

export const ACCOUNT_PORT = 'IAccountPort';

export interface IAccountPort {
  findBankAccount(accountNumber: string): Promise<Account>;
  saveBankAccount(account: Account): Promise<void>;
  updateBankAccount(id: string, account: Account): Promise<boolean>;
  findAccountByUserId(userId: string): Promise<Account>;
}
