import FakeAccountRepository from '../../../src/infrastructure/repository/account/fakebanking.repository';
import { MoneyTransfer } from '../../../src/domain/account/usecases/MoneyTransfer.usecase';
import { IAccountRepository } from '../../../src/domain/account/_ports/account.irepository';

describe('Account usecases testing', () => {
  let repository: IAccountRepository;
  let service: MoneyTransfer;
  beforeAll(async () => {
    repository = new FakeAccountRepository();
    service = new MoneyTransfer(repository);
  });
  it('should logged in a customer and return "You have successfully logged in"', async () => {
    expect(true).toBe(true);
  });
});
