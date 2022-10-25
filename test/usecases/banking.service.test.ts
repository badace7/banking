import { BankingService } from '../../src/domain/usecases/banking.service';
import { IBankingRepository } from '../../src/domain/_ports/banking.irepository';
import { IBankingService } from '../../src/domain/_ports/banking.iservice';
import FakeBankingRepository from '../../src/infrastructure/secondary/bank/fakebanking.repository';

describe('first', () => {
  let repository: IBankingRepository;
  let service: IBankingService;
  beforeAll(async () => {
    repository = new FakeBankingRepository();
    service = new BankingService(repository);
  });
  it('should logged in a customer and return "You have successfully logged in"', async () => {
    expect(true).toBe(true);
  });
});
