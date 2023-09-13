import FakeAccountRepository from '../../_write/adapters/secondary/in-memory/account.fake.adapter';
import { FakeEventPublisher } from '../../_write/adapters/secondary/in-memory/event-publisher.fake.adapter';
import { DepositCommand } from '../../_write/core/commands/deposit.command';
import { Deposit } from '../../_write/core/commands/deposit.command-handler';
import Account from '../../_write/core/domain/account';

export const createDepositFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const eventPublisher = new FakeEventPublisher();

  const depositUsecase = new Deposit(accountRepository, eventPublisher);

  let accountToCredit: Account;

  let thrownError: Error;

  return {
    givenJackHasABankAccount(account: Account) {
      accountToCredit = account;
      accountRepository.saveBankAccount(account);
    },
    async whenJackDepositMoney(command: DepositCommand) {
      try {
        await depositUsecase.execute(command);
      } catch (err) {
        thrownError = err;
      }
    },
    async thenHisBalanceShouldBe(expectedBalance: number) {
      const account = await accountRepository.findBankAccount(
        accountToCredit.data.number,
      );
      expect(account.data.balance).toEqual(expectedBalance);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type DepositFixture = ReturnType<typeof createDepositFixture>;
