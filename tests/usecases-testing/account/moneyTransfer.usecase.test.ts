import { accounts } from '../../mocks/AccountsAndCustomers';

import { IAccountPort } from 'src/core/account/application/_ports/account.iport';
import { IEventPort } from 'src/core/account/application/_ports/transaction.iport';

import { CreateTransferCommand } from 'src/core/account/application/commands/transfer.command';
import { MoneyTransfer } from 'src/core/account/application/commands/moneytransfer.usecase';
import FakeAccountRepository from 'src/infrastructure/account/output/account.fake.adapter';
import FakeEventStorDBAdapter from 'src/infrastructure/transaction/output/eventstore.fake.adapter';

describe('Money transfer usecases testing', () => {
  let moneyTransferUsecase: MoneyTransfer;
  let AccountRepository: IAccountPort;
  let TransactionRepository: IEventPort;
  beforeAll(async () => {
    AccountRepository = new FakeAccountRepository();
    TransactionRepository = new FakeEventStorDBAdapter();

    accounts.forEach((account) => {
      AccountRepository.saveBankAccount(account);
    });

    moneyTransferUsecase = new MoneyTransfer(
      AccountRepository,
      TransactionRepository,
    );
  });
  describe('Success case', () => {
    it('should transfer 1000€ from one customer account to another', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '12312312312',
        balance: 1000,
      };
      const bobAccount = {
        number: '98797897897',
        balance: 1000,
      };
      //AND Jack wants to do a money transfer in the amount of 1000€ to his friend named Bob has shown below
      const transferTransaction = new CreateTransferCommand({
        label: "Participation in Anna's gift",
        amount: 1000,
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
    });

    it('should transfer 2500€ from one customer account that has overdraft authorization to another', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const bobAccount = {
        number: '98797897897',
        balance: 2000,
      };
      const jackAccount = {
        number: '12312312312',
        balance: 0,
      };
      //AND Bob wants to do a money transfer in the amount of 2500€ to his friend named Bob has shown below
      const transferTransaction = new CreateTransferCommand({
        label: 'Spain holiday',
        amount: 2500,
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
    });
  });

  describe('Echec case', () => {
    it('should try to transfer 3000€ from one customer account to another and return "You cannot make this transfer because your balance is insufficient"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '12312312312',
        balance: 2500,
      };
      const bobAccount = {
        number: '98797897897',
        balance: -500,
      };
      //AND jack wants to do a money transfer in the amount of 3000€ to his friend named Jack has shown below
      const transferTransaction = new CreateTransferCommand({
        label: 'Car accident',
        amount: 3000,
        from: jackAccount.number,
        to: bobAccount.number,
      });
      //AND Jack does not have sufficient balance and does not have an overdraft authorization to make this transfer
      //WHEN Jack try to do the money transfer
      const jackGivesATry = () =>
        moneyTransferUsecase.execute(transferTransaction);
      //THEN the message is displayed as shown below
      await expect(jackGivesATry).rejects.toThrow(
        'You cannot make this transaction because your balance is insufficient',
      );
    });

    it('should try to transfer 100€ from one customer account to another and return "your overdraft authorization does not allow you to perform this operation"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const bobAccount = {
        number: '98797897897',
        balance: -500,
      };
      const jackAccount = {
        number: '12312312312',
        balance: 2500,
      };
      //AND Bob wants to do a money transfer in the amount of 3000€ to his friend named Jack has shown below
      const transferTransaction = new CreateTransferCommand({
        label: 'Car accident',
        amount: 100,
        from: bobAccount.number,
        to: jackAccount.number,
      });
      //AND Bob does not have sufficient balance and does not have an overdraft authorization to make this transfer
      //WHEN Bob try to do the money transfer
      const bobGivesATry = () =>
        moneyTransferUsecase.execute(transferTransaction);
      //THEN the message is displayed as shown below
      await expect(bobGivesATry).rejects.toThrow(
        'You cannot make this transaction because your balance is insufficient',
      );
    });
  });
});
