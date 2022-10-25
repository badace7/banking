import AccountDomain from '../account/account.domain';

export interface IBankingRepository {
  findBankAccount(accountNumber: string): Promise<AccountDomain>;
}
