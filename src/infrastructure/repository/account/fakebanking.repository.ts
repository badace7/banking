import { IAccountRepository } from 'src/domain/account/_ports/account.irepository';
import AccountDomain from '../../../domain/account/entities/account.domain';

class FakeAccountRepository implements IAccountRepository {
  private fakeAccountEntityManager;

  constructor(account?: AccountDomain) {
    this.fakeAccountEntityManager = new Map<string, AccountDomain>([
      [account?.getNumber(), account],
    ]);
  }
  async updateBankAccount(
    accountId: string,
    account: AccountDomain,
  ): Promise<void> {
    this.fakeAccountEntityManager.delete(accountId);
    this.fakeAccountEntityManager.set(accountId, account);
  }

  async findBankAccount(accountNumber: string): Promise<AccountDomain> {
    return this.fakeAccountEntityManager.get(accountNumber);
  }

  async saveBankAccount(account: AccountDomain): Promise<void> {
    this.fakeAccountEntityManager.set(account.getNumber(), account);
  }
}

export default FakeAccountRepository;
