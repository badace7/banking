import FakeAccountRepository from '../../../src/infrastructure/repository/account/fakebanking.repository';
import { IAccountRepository } from '../../../src/domain/account/_ports/account.irepository';
import { MoneyTransferUsecase } from '../../../src/domain/transaction/usecases/MoneyTransfer.usecase';
import { accounts, customers } from '../../mocks/AccountsAndCustomers';
import { ICustomerRepository } from '../../../src/domain/customer/_ports/customer.irepository';
import FakeCustomerRepository from '../../../src/infrastructure/repository/customer/fakecustomer.repository';
import { ITransactionRepository } from 'src/domain/transaction/_ports/transaction.irepository';
import FakeTransactionRepository from '../../../src/infrastructure/repository/transaction/fakeTransaction.repository';
import TransferTransactionDomain from '../../../src/domain/transaction/entities/transaction.domain';

describe('Money transfer usecases testing', () => {
  let moneyTransferUsecase: MoneyTransferUsecase;
  let AccountRepository: IAccountRepository;
  let CustomerRepository: ICustomerRepository;
  let TransactionRepository: ITransactionRepository;
  beforeAll(async () => {
    AccountRepository = new FakeAccountRepository();
    CustomerRepository = new FakeCustomerRepository();
    TransactionRepository = new FakeTransactionRepository();

    customers.forEach((customer) => {
      CustomerRepository.saveCustomer(customer);
    });
    accounts.forEach((account) => {
      AccountRepository.saveBankAccount(account);
    });

    moneyTransferUsecase = new MoneyTransferUsecase(
      AccountRepository,
      CustomerRepository,
      TransactionRepository,
    );
  });
  describe('Success case', () => {
    it('should transfer 100€ from one customer account to another and return "You have successfully transfered 100€ to [customer name]"', async () => {
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

    it('should transfer 1100€ from one customer account to another and return "You have successfully transfered 1100€ to [customer name]"', async () => {
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
      const message = await moneyTransferUsecase.execute(transferTransaction);

      //THEN the message is displayed as shown below
      expect(message).toBe('You have successfully transfered 1100€ to Jack');
      // add feat notif 0
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
      const bobGivesATry = () =>
        moneyTransferUsecase.execute(transferTransaction);
      //THEN the message is displayed as shown below
      await expect(bobGivesATry).rejects.toThrow(
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
      const jackGivesATry = () =>
        moneyTransferUsecase.execute(transferTransaction);
      //THEN the message is displayed as shown below
      await expect(jackGivesATry).rejects.toThrow(
        'You cannot make this transfer because your balance is insufficient',
      );
    });
  });
});
