import { MoneyTransferCommand } from 'src/core/transaction/application/commands/transfer.command';
import Account from '../../../src/core/transaction/domain/account';
import FakeAccountRepository from 'src/infrastructure/account/output/account.fake.adapter';
import { MoneyTransfer } from 'src/core/transaction/application/commands/moneytransfer.usecase';
import FakeEventStorDBAdapter from 'src/infrastructure/transaction/output/eventstore.fake.adapter';

export const createTransferFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const transactionRepository = new FakeEventStorDBAdapter();
  const moneyTransferUsecase = new MoneyTransfer(
    accountRepository,
    transactionRepository,
  );

  let accountAtOrigin: Account;
  let accountAtReception: Account;

  let thrownError: Error;

  return {
    givenTheFollowingCustomerThatWantToMakeMoneyTransfer(account: Account) {
      accountAtOrigin = account;
      accountRepository.saveBankAccount(account);
    },
    andTheFollowingCustomerThatWantToReceiveMoneyTransfer(account: Account) {
      accountAtReception = account;
      accountRepository.saveBankAccount(account);
    },
    async whenCustomerMakesAmoneyTransfer(
      moneyTransferCommand: MoneyTransferCommand,
    ) {
      try {
        await moneyTransferUsecase.handle(moneyTransferCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    async thenTheBalanceOfAccountAtTheOriginOfTransferShouldBe(
      expectedBalance: number,
    ) {
      const account = await accountRepository.findBankAccount(
        accountAtOrigin.data.number,
      );

      expect(account.data.balance).toEqual(expectedBalance);
    },
    async AndTheBalanceOfAccountAtTheReceptionOfTransferShouldBe(
      expectedBalance: number,
    ) {
      const account = await accountRepository.findBankAccount(
        accountAtReception.data.number,
      );
      expect(account.data.balance).toEqual(expectedBalance);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type TransferFixture = ReturnType<typeof createTransferFixture>;
