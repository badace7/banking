import { IAccountRepository } from 'src/domain/account/_ports/output/account.irepository';
import TransferTransactionDomain from 'src/domain/account/entities/transaction.domain';
import { MoneyTransferUsecase } from 'src/domain/account/usecases/moneytransfer.usecase';
import { ITransactionRepository } from 'src/domain/account/_ports/output/transaction.irepository';
import FakeAccountRepository from 'src/infrastructure/fakeRepositories/account/fakebanking.repository';
import FakeTransactionRepository from 'src/infrastructure/fakeRepositories/transaction/fakeTransaction.repository';
import { accounts } from '../../mocks/AccountsAndCustomers';

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
    it('should transfer 1000€ from one customer account to another', async () => {
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
      //AND Jack wants to do a money transfer in the amount of 1000€ to his friend named Bob has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 1000,
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
      ).toBe(0);
      expect(
        (
          await AccountRepository.findBankAccount(bobAccount.number)
        ).getBalance(),
      ).toBe(2000);

      //AND The transfer transaction is created as shown below
      expect(await TransactionRepository.getAll()).toContain(
        transferTransaction,
      );
    });

    it('should transfer 2500€ from one customer account that has overdraft authorization to another', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const bobAccount = {
        number: '0987',
        balance: 2000,
      };
      const jackAccount = {
        number: '0123',
        balance: 0,
      };
      //AND Bob wants to do a money transfer in the amount of 2500€ to his friend named Bob has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 2500,
        label: 'Spain holiday',
        from: bobAccount.number,
        to: jackAccount.number,
      });
      //AND Bob does not have sufficient balance but he has an overdraft authorization in the amount of 500€ to make this transfer
      //WHEN Back does the money transfer
      await moneyTransferUsecase.execute(transferTransaction);

      //THEN Jack's and Bob's balances should be as shown below after receiving the transfer
      expect(
        (
          await AccountRepository.findBankAccount(bobAccount.number)
        ).getBalance(),
      ).toBe(-500);
      expect(
        (
          await AccountRepository.findBankAccount(jackAccount.number)
        ).getBalance(),
      ).toBe(2500);

      //AND The transfer transaction is created as shown below
      expect(await TransactionRepository.getAll()).toContain(
        transferTransaction,
      );
    });
  });

  describe('Echec case', () => {
    it('should try to transfer 3000€ from one customer account to another and return "You cannot make this transfer because your balance is insufficient"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '0123',
        balance: 2500,
      };
      const bobAccount = {
        number: '0987',
        balance: -500,
      };
      //AND jack wants to do a money transfer in the amount of 3000€ to his friend named Jack has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 3000,
        label: 'Car accident',
        from: jackAccount.number,
        to: bobAccount.number,
      });
      //AND Jack does not have sufficient balance and does not have an overdraft authorization to make this transfer
      //WHEN Jack try to do the money transfer
      const jackGivesATry = () =>
        moneyTransferUsecase.execute(transferTransaction);
      //THEN the message is displayed as shown below
      await expect(jackGivesATry).rejects.toThrow(
        'You cannot make this transfer because your balance is insufficient',
      );
    });

    it('should try to transfer 100€ from one customer account to another and return "your overdraft authorization does not allow you to perform this operation"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const bobAccount = {
        number: '0987',
        balance: -500,
      };
      const jackAccount = {
        number: '0123',
        balance: 2500,
      };
      //AND Bob wants to do a money transfer in the amount of 3000€ to his friend named Jack has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 100,
        label: 'Car accident',
        from: bobAccount.number,
        to: jackAccount.number,
      });
      //AND Bob does not have sufficient balance and does not have an overdraft authorization to make this transfer
      //WHEN Bob try to do the money transfer
      const bobGivesATry = () =>
        moneyTransferUsecase.execute(transferTransaction);
      //THEN the message is displayed as shown below
      await expect(bobGivesATry).rejects.toThrow(
        'your overdraft authorization does not allow you to perform this operation',
      );
    });
  });
});
