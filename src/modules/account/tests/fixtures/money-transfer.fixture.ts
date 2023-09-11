import FakeAccountRepository from '../../_write/adapters/secondary/in-memory/account.fake.adapter';
import { FakeEventPublisher } from '../../_write/adapters/secondary/in-memory/event-publisher.fake.adapter';
import { MoneyTransfer } from '../../_write/core/commands/moneytransfer.command-handler';
import { MoneyTransferCommand } from '../../_write/core/commands/transfer.command';
import Account from '../../_write/core/domain/account';

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
