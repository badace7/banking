import { MoneyTransfer } from '../../application/commands/moneytransfer.usecase';
import { MoneyTransferCommand } from '../../application/commands/transfer.command';
import Account from '../../domain/account';
import FakeAccountRepository from '../../infra/driven/in-memory/account.fake.adapter';
import { FakeEventPublisher } from '../../infra/driven/in-memory/event-publisher.fake.adapter';

export const createTransferFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const eventPublisher = new FakeEventPublisher();
  const moneyTransferUsecase = new MoneyTransfer(
    accountRepository,
    eventPublisher,
  );

  let accountAtOrigin: Account;
  let accountAtReception: Account;

  let thrownError: Error;

  return {
    givenJackHasABankAccount(account: Account) {
      accountAtOrigin = account;
      accountRepository.saveBankAccount(account);
    },

    andBobHasAbankAccount(account: Account) {
      accountAtReception = account;
      accountRepository.saveBankAccount(account);
    },
    async whenJackMakesAmoneyTransfer(
      moneyTransferCommand: MoneyTransferCommand,
    ) {
      try {
        await moneyTransferUsecase.execute(moneyTransferCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    async thenJackBalanceShouldBe(expectedBalance: number) {
      const account = await accountRepository.findBankAccount(
        accountAtOrigin.data.number,
      );

      expect(account.data.balance).toEqual(expectedBalance);
    },
    async AndBobBalanceShouldBe(expectedBalance: number) {
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
