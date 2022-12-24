import FakeAccountRepository from '../../../src/infrastructure/repository/account/fakebanking.repository';
import { IAccountRepository } from '../../../src/domain/account/_ports/account.irepository';
import { MoneyTransferUsecase } from '../../../src/domain/transaction/usecases/MoneyTransfer.usecase';
import { accounts, customers } from '../../mocks/AccountsAndCustomers';
import { ICustomerRepository } from '../../../src/domain/customer/_ports/customer.irepository';
import FakeCustomerRepository from '../../../src/infrastructure/repository/customer/fakecustomer.repository';
import { ITransactionRepository } from 'src/domain/transaction/_ports/transaction.irepository';
import FakeTransactionRepository from '../../../src/infrastructure/repository/transaction/fakeTransaction.repository';
import TransferTransactionDomain from '../../../src/domain/transaction/domain/transaction.domain';

describe('Money transfer usecases testing', () => {
  let moneyTransferUsecase: MoneyTransferUsecase;
  beforeAll(async () => {
    const AccountRepository: IAccountRepository = new FakeAccountRepository();
    const CustomerRepository: ICustomerRepository =
      new FakeCustomerRepository();
    const TransactionRepository: ITransactionRepository =
      new FakeTransactionRepository();

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

    //WHEN Jack does the money transfer a transaction is created
    const message = await moneyTransferUsecase.execute(transferTransaction);

    //THEN the message is displayed as shown below
    expect(message).toBe('You have successfully transfered 100€ to Bob');
  });

  it('should transfer 1000€ from one customer account to another and return "You have successfully transfered 1000€ to [customer name]"', async () => {
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
    //AND Bob wants to do a money transfer in the amount of 1000€ to his friend named Jack has shown below
    const transferTransaction = TransferTransactionDomain.create({
      amount: 1000,
      label: 'Reimbursement for the car accident',
      from: bobAccount.number,
      to: jackAccount.number,
    });

    //WHEN Bob does the money transfer a transaction is created
    const message = await moneyTransferUsecase.execute(transferTransaction);

    //THEN the message is displayed as shown below
    expect(message).toBe('You have successfully transfered 1000€ to Jack');
  });
  it('should try to transfer 1200€ from one customer account to another and return "You cannot make this transfer because your balance is insufficient"', async () => {
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
    //AND Jack wants to do a money transfer in the amount of 1200€ to his friend named Bob has shown below
    const transferTransaction = TransferTransactionDomain.create({
      amount: 1200,
      label: "Participation in Anna's gift",
      from: jackAccount.number,
      to: bobAccount.number,
    });
    //AND Jack does not have sufficient balance and does not have an overdraft authorization to make this transfer
    //WHEN Jack try to do the money transfer
    try {
      await moneyTransferUsecase.execute(transferTransaction);
    } catch (error: any) {
      //THEN the message is displayed as shown below
      expect(error.message).toBe(
        'You cannot make this transfer because your balance is insufficient',
      );
    }
  });
});
