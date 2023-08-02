import Account from 'src/modules/banking/domain/account';

export const ACCOUNT_PORT = 'IAccountPort';

export interface IAccountPort {
  findBankAccount(accountNumber: string): Promise<Account>;
  saveBankAccount(account: Account): Promise<void>;
  updateBankAccount(accountId: string, account: Account): Promise<Account>;
}
