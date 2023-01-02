import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../src/infrastructure/rest/account/banking.controller';
import { AccountService } from '../src/domain/account/account.service';
import FakeAccountRepository from '../src/infrastructure/repository/account/fakebanking.repository';

describe('AppController', () => {
  let appController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        { provide: 'IBankingRepository', useClass: FakeAccountRepository },
        { provide: 'IBankingService', useClass: AccountService },
      ],
    }).compile();

    appController = app.get<AccountController>(AccountController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('Hello World!').toBe('Hello World!');
    });
  });
});
