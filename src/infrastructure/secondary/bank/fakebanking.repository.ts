import { IBankingRepository } from '../../../domain/_ports/banking.irepository';
import AccountDomain from '../../../domain/account/account.domain';

class FakeBankingRepository implements IBankingRepository {
  private accountDatas = new Map<string, AccountDomain>();

  findBankAccount(accountNumber: string): Promise<AccountDomain> {
    throw new Error('Method not implemented.');
  }
}

export default FakeBankingRepository;
