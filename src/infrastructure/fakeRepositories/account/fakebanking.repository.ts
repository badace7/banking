import AccountDomain from 'src/domain/account/entities/account.domain';
import { IAccountRepository } from 'src/domain/account/_ports/output/account.irepository';

class FakeAccountRepository implements IAccountRepository {
  private fakeAccountEntityManager;

  constructor(account?: AccountDomain) {
    this.fakeAccountEntityManager = new Map<string, AccountDomain>([
      [account?.getNumber(), account],
    ]);
  }
  async updateBankAccount(
    number: string,
    account: AccountDomain,
  ): Promise<AccountDomain> {
    const isAccountExist = this.fakeAccountEntityManager.has(number);

    if (!isAccountExist) {
      return;
    }
    this.fakeAccountEntityManager.delete(number);
    this.fakeAccountEntityManager.set(number, account);

    return this.fakeAccountEntityManager.get(number);
  }

  async findBankAccount(accountNumber: string): Promise<AccountDomain> {
    return this.fakeAccountEntityManager.get(accountNumber);
  }

  async saveBankAccount(account: AccountDomain): Promise<void> {
    this.fakeAccountEntityManager.set(account.getNumber(), account);
  }
}

export default FakeAccountRepository;
