import { IAccountPort } from 'src/core/account/application/_ports/account.iport';
import AccountDomain from 'src/core/account/domain/account.domain';

class FakeAccountRepository implements IAccountPort {
  private fakeAccountEntityManager: Map<string, AccountDomain> = new Map();

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
