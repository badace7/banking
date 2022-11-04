import AccountDomain from '../../../domain/account/account.domain';

class FakeAccountRepository implements FakeAccountRepository {
  private accountDatas = new Map<string, AccountDomain>();

  findBankAccount(accountNumber: string): Promise<AccountDomain> {
    throw new Error('Method not implemented.');
  }
}

export default FakeAccountRepository;
