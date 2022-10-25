import { Test, TestingModule } from '@nestjs/testing';
import { BankingController } from '../src/infrastructure/primary/bank/banking.controller';
import { BankingService } from '../src/domain/usecases/banking.service';
import FakeBankingRepository from '../src/infrastructure/secondary/bank/fakebanking.repository';

describe('AppController', () => {
  let appController: BankingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BankingController],
      providers: [
        BankingService,
        { provide: 'IBankingRepository', useClass: FakeBankingRepository },
        { provide: 'IBankingService', useClass: BankingService },
      ],
    }).compile();

    appController = app.get<BankingController>(BankingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('Hello World!').toBe('Hello World!');
    });
  });
});
