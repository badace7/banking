import FakeAccountRepository from '../../../src/infrastructure/repository/account/fakebanking.repository';
import { IAccountRepository } from '../../../src/domain/account/_ports/account.irepository';
import { MoneyTransferUsecase } from '../../../src/domain/transaction/usecases/moneytransfer.usecase';
import { accounts } from '../../mocks/AccountsAndCustomers';
import { ITransactionRepository } from 'src/domain/transaction/_ports/output/transaction.irepository';
import FakeTransactionRepository from '../../../src/infrastructure/repository/transaction/fakeTransaction.repository';
import TransferTransactionDomain from '../../../src/domain/transaction/entities/transaction.domain';

describe('Money transfer usecases testing', () => {
  let moneyTransferUsecase: MoneyTransferUsecase;
  let AccountRepository: IAccountRepository;
  let TransactionRepository: ITransactionRepository;
  beforeAll(async () => {
    AccountRepository = new FakeAccountRepository();
    TransactionRepository = new FakeTransactionRepository();

    accounts.forEach((account) => {
      AccountRepository.saveBankAccount(account);
    });

    moneyTransferUsecase = new MoneyTransferUsecase(
      AccountRepository,
      TransactionRepository,
    );
  });
  describe('Success case', () => {
    it('should transfer 100€ from one customer account to another', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '0123',
        balance: 1000,
      };
      const bobAccount = {
        number: '0987',
        balance: 1000,
      };
      //AND Jack wants to do a money transfer in the amount of 100€ to his friend named Bob has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 100,
        label: "Participation in Anna's gift",
        from: jackAccount.number,
        to: bobAccount.number,
      });

      //WHEN Jack does the money transfer
      await moneyTransferUsecase.execute(transferTransaction);
      //THEN Jack's and Bob's balances should be as shown below after receiving the transfer
      expect(
        (
          await AccountRepository.findBankAccount(jackAccount.number)
        ).getBalance(),
      ).toBe(900);
      expect(
        (
          await AccountRepository.findBankAccount(bobAccount.number)
        ).getBalance(),
      ).toBe(1100);
    });

    it('should transfer 1100€ from one customer account to another and return a notification "be careful your balance has reached 0"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '0123',
        balance: 900,
      };
      const bobAccount = {
        number: '0987',
        balance: 1100,
      };
      //AND Bob wants to do a money transfer in the amount of 1000€ to his friend named Jack has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 1100,
        label: 'Reimbursement for the car accident',
        from: bobAccount.number,
        to: jackAccount.number,
      });

      //WHEN Bob does the money transfer
      await moneyTransferUsecase.execute(transferTransaction);

      //THEN the message is displayed as shown below
      //THEN Jack's and Bob's balances should be as shown below after receiving the transfer
      expect(
        (
          await AccountRepository.findBankAccount(jackAccount.number)
        ).getBalance(),
      ).toBe(2000);
      expect(
        (
          await AccountRepository.findBankAccount(bobAccount.number)
        ).getBalance(),
      ).toBe(0);
    });
  });

  describe('Echec case', () => {
    it('should try to transfer 10€ from one customer account to another and return "You cannot make this transfer because your balance is insufficient"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '0123',
        balance: 2000,
      };
      const bobAccount = {
        number: '0987',
        balance: 0,
      };
      //AND Bob wants to do a money transfer in the amount of 10€ to his friend named Jack has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 10,
        label: "For today's meal",
        from: bobAccount.number,
        to: jackAccount.number,
      });
      //AND Bob does not have sufficient balance and does not have an overdraft authorization to make this transfer
      //WHEN Bob try to do the money transfer
      const bobGivesATry = await moneyTransferUsecase.execute(
        transferTransaction,
      );

      //THEN the message is displayed as shown below
      expect(bobGivesATry.getError()).toBe(
        'You cannot make this transfer because your balance is insufficient',
      );
    });

    it('should try to transfer 2100€ from one customer account to another and return "You cannot make this transfer because your balance is insufficient"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '0123',
        balance: 2000,
      };
      const bobAccount = {
        number: '0987',
        balance: 0,
      };
      //AND Jack wants to do a money transfer in the amount of 1200€ to his friend named Bob has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 2100,
        label: 'Help because you are my friend',
        from: jackAccount.number,
        to: bobAccount.number,
      });
      //AND Jack does not have sufficient balance and does not have an overdraft authorization to make this transfer
      //WHEN Jack try to do the money transfer
      const jackGivesATry = await moneyTransferUsecase.execute(
        transferTransaction,
      );
      //THEN the message is displayed as shown below
      expect(jackGivesATry.getError()).toBe(
        'You cannot make this transfer because your balance is insufficient',
      );
    });
  });
});
