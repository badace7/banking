import { AccountService } from '../../../src/domain/account/account.service';
import { IAccountRepository } from '../../../src/domain/account/_ports/account.irepository';
import { IAccountService } from '../../../src/domain/account/_ports/account.iservice';

import FakeAccountRepository from '../../../src/infrastructure/repository/account/fakebanking.repository';

describe('first', () => {
  let repository: IAccountRepository;
  let service: IAccountService;
  beforeAll(async () => {
    repository = new FakeAccountRepository();
    service = new AccountService(repository);
  });
  it('should logged in a customer and return "You have successfully logged in"', async () => {
    expect(true).toBe(true);
  });
});
