import { WithdrawCommand } from 'src/core/transaction/application/commands/withdraw.command';
import { Withdraw } from 'src/core/transaction/application/commands/withdraw.usecase';
import Account from 'src/core/transaction/domain/account';
import FakeAccountRepository from 'src/infrastructure/account/output/account.fake.adapter';
import FakeEventStorDBAdapter from 'src/infrastructure/transaction/output/eventstore.fake.adapter';

export const createWithdrawFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const transactionRepository = new FakeEventStorDBAdapter();
  const withdrawUsecase = new Withdraw(
    accountRepository,
    transactionRepository,
  );

  let accountToDebit: Account;

  let thrownError: Error;

  return {
    givenTheFollowingCustomerThatWantToWithdrawMoney(account: Account) {
      accountToDebit = account;
      accountRepository.saveBankAccount(account);
    },
    async whenCustomerMakesAWithdraw(command: WithdrawCommand) {
      try {
        await withdrawUsecase.handle(command);
      } catch (err) {
        thrownError = err;
      }
    },
    async thenTheBalanceShouldBe(expectedBalance: number) {
      const account = await accountRepository.findBankAccount(
        accountToDebit.data.number,
      );

      expect(account.data.balance).toEqual(expectedBalance);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type WithdrawFixture = ReturnType<typeof createWithdrawFixture>;
