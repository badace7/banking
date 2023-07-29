import { IAccountPort } from '../../application/_ports/account.iport';
import Account from '../../domain/account';

class FakeAccountRepository implements IAccountPort {
  private fakeAccountEntityManager: Map<string, Account> = new Map();

  async updateBankAccount(number: string, account: Account): Promise<Account> {
    const isAccountExist = this.fakeAccountEntityManager.has(number);

    if (!isAccountExist) {
      return;
    }
    this.fakeAccountEntityManager.delete(number);
    this.fakeAccountEntityManager.set(number, account);

    return this.fakeAccountEntityManager.get(number);
  }

  async findBankAccount(accountNumber: string): Promise<Account> {
    return this.fakeAccountEntityManager.get(accountNumber);
  }

  async saveBankAccount(account: Account): Promise<void> {
    this.fakeAccountEntityManager.set(account.data.number, account);
  }
}

export default FakeAccountRepository;
