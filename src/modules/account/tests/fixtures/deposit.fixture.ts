import FakeAccountRepository from '../../adapters/secondary/in-memory/account.fake.adapter';
import { FakeEventPublisher } from '../../adapters/secondary/in-memory/event-publisher.fake.adapter';
import { DepositCommand } from '../../core/commands/deposit.command';
import { Deposit } from '../../core/commands/deposit.command-handler';
import Account from '../../core/domain/account';

export const createDepositFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const eventPublisher = new FakeEventPublisher();

  const depositUsecase = new Deposit(accountRepository, eventPublisher);

  let accountToCredit: Account;

  return {
    givenJackHasABankAccount(account: Account) {
      accountToCredit = account;
      accountRepository.saveBankAccount(account);
    },
    async whenJackDepositMoney(command: DepositCommand) {
      await depositUsecase.execute(command);
    },
    async thenHisBalanceShouldBe(expectedBalance: number) {
      const account = await accountRepository.findBankAccount(
        accountToCredit.data.number,
      );
      expect(account.data.balance).toEqual(expectedBalance);
    },
  };
};

export type DepositFixture = ReturnType<typeof createDepositFixture>;
