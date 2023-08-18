import { DepositCommand } from 'src/modules/banking/application/commands/deposit.command';
import { Deposit } from 'src/modules/banking/application/commands/deposit.usecase';
import Account from 'src/modules/banking/domain/account';
import { Operation } from 'src/modules/banking/domain/operation';
import FakeOperationRepository from '../../infra/driven/operation.fake.adapter';
import { StubDateProvider } from '../../infra/driven/date-provider.fake.adapter';
import FakeAccountRepository from '../../infra/driven/account.fake.adapter';

export const createDepositFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const operationRepository = new FakeOperationRepository();
  const dateProvider = new StubDateProvider();

  const depositUsecase = new Deposit(
    accountRepository,
    operationRepository,
    dateProvider,
  );

  let accountToCredit: Account;

  return {
    givenJackHasABankAccount(account: Account) {
      accountToCredit = account;
      accountRepository.saveBankAccount(account);
    },
    andJackWantsToDepositMoneyNow(date: Date) {
      dateProvider.now = date;
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
    async AndTransferOperationShouldBeRecorded(expectedOperation: Operation) {
      const operations = await operationRepository.getAllOfAccount(
        accountToCredit.data.id,
      );
      expect(operations).toContainEqual(expectedOperation);
    },
  };
};

export type DepositFixture = ReturnType<typeof createDepositFixture>;
