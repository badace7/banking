import { WithdrawCommand } from '../../application/commands/withdraw.command';
import { Withdraw } from '../../application/commands/withdraw.usecase';
import Account from '../../domain/account';
import FakeAccountRepository from '../../infra/driven/in-memory/account.fake.adapter';
import { FakeEventPublisher } from '../../infra/driven/in-memory/event-publisher.fake.adapter';

export const createWithdrawFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const eventPublisher = new FakeEventPublisher();
  const withdrawUsecase = new Withdraw(accountRepository, eventPublisher);

  let accountToDebit: Account;

  let thrownError: Error;

  return {
    givenJackHasABankAccount(account: Account) {
      accountToDebit = account;
      accountRepository.saveBankAccount(account);
    },

    async whenJackMakesAWithdraw(command: WithdrawCommand) {
      try {
        await withdrawUsecase.execute(command);
      } catch (err) {
        thrownError = err;
      }
    },
    async thenHisBalanceShouldBe(expectedBalance: number) {
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
