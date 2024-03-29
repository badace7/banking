import { IAccountPort } from '../../../core/_ports/repositories/account.iport';
import Account from '../../../core/domain/account';

class FakeAccountRepository implements IAccountPort {
  private fakeAccountEntityManager: Map<string, Account> = new Map();

  async updateBankAccount(id: string, account: Account): Promise<boolean> {
    const accountToUpdate = this.fakeAccountEntityManager.has(id);
    if (!accountToUpdate) return false;
    this.fakeAccountEntityManager.delete(id);
    this.fakeAccountEntityManager.set(id, account);
    return true;
  }

  async findBankAccount(accountNumber: string): Promise<Account> {
    return [...this.fakeAccountEntityManager.values()].find(
      (account) => account.data.number === accountNumber,
    );
  }

  async saveBankAccount(account: Account): Promise<void> {
    this.fakeAccountEntityManager.set(account.data.id, account);
  }
  findAccountByUserId(userId: string): Promise<Account> {
    throw new Error('Method not implemented.');
  }
}

export default FakeAccountRepository;
