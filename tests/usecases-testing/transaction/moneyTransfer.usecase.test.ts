import { IAccountRepository } from 'src/domain/account/_ports/account.irepository';
import TransferTransactionDomain from 'src/domain/transaction/entities/transaction.domain';
import { MoneyTransferUsecase } from 'src/domain/transaction/usecases/moneytransfer.usecase';
import { ITransactionRepository } from 'src/domain/transaction/_ports/output/transaction.irepository';
import FakeAccountRepository from 'src/infrastructure/repository/account/fakebanking.repository';
import FakeTransactionRepository from 'src/infrastructure/repository/transaction/fakeTransaction.repository';
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
      //AND Jack wants to do a money transfer in the amount of 100€ to his friend named Bob has shown below
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
    });
  });

  describe('Echec case', () => {
    it('should try to transfer 10€ from one customer account to another and return "You cannot make this transfer because your balance is insufficient"', async () => {
      //GIVEN customers named Jack and bob
      //AND They have a bank account with account numbers as shown below
      const jackAccount = {
        number: '0123',
        balance: 0,
      };
      const bobAccount = {
        number: '0987',
        balance: 2000,
      };
      //AND jack wants to do a money transfer in the amount of 10€ to his friend named Jack has shown below
      const transferTransaction = TransferTransactionDomain.create({
        amount: 10,
        label: "For today's meal",
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
