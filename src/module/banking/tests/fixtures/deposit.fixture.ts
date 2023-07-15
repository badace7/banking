import { DepositCommand } from 'src/module/banking/application/commands/deposit.command';
import { Deposit } from 'src/module/banking/application/commands/deposit.usecase';
import Account from 'src/module/banking/domain/account';
import { Operation } from 'src/module/banking/domain/operation';
import FakeAccountRepository from 'src/module/banking/infra/account.fake.adapter';
import { StubDateProvider } from 'src/module/banking/infra/date-provider.fake.adapter';
import FakeOperationRepository from 'src/module/banking/infra/operation.fake.adapter';

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
      const operations = await operationRepository.getAllOfCustomer(
        accountToCredit.data.number,
      );
      expect(operations).toContainEqual(expectedOperation);
    },
  };
};

export type DepositFixture = ReturnType<typeof createDepositFixture>;
