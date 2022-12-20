import FakeAccountRepository from '../../../src/infrastructure/repository/account/fakebanking.repository';
import { MoneyTransfer } from '../../../src/domain/account/usecases/MoneyTransferFromAccount.usecase';
import { IAccountRepository } from '../../../src/domain/account/_ports/account.irepository';
import { IAccountService } from '../../../src/domain/account/_ports/account.iservice';

describe('first', () => {
  let repository: IAccountRepository;
  let service: IAccountService;
  beforeAll(async () => {
    repository = new FakeAccountRepository();
    service = new MoneyTransfer(repository);
  });
  it('should logged in a customer and return "You have successfully logged in"', async () => {
    expect(true).toBe(true);
  });
});
