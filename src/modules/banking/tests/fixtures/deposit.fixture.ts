import { DepositCommand } from 'src/modules/banking/application/commands/deposit.command';
import { Deposit } from 'src/modules/banking/application/commands/deposit.usecase';
import Account from 'src/modules/banking/domain/account';
import { Operation } from 'src/modules/banking/domain/operation';
import FakeOperationRepository from '../../infra/driven/in-memory/operation.fake.adapter';
import { FakeDateAdapter } from '../../infra/driven/in-memory/date-provider.fake.adapter';
import FakeAccountRepository from '../../infra/driven/in-memory/account.fake.adapter';

export const createDepositFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const operationRepository = new FakeOperationRepository();
  const dateAdapter = new FakeDateAdapter();

  const depositUsecase = new Deposit(
    accountRepository,
    operationRepository,
    dateAdapter,
    null,
  );

  let accountToCredit: Account;

  return {
    givenJackHasABankAccount(account: Account) {
      accountToCredit = account;
      accountRepository.saveBankAccount(account);
    },
    andJackWantsToDepositMoneyNow(date: Date) {
      dateAdapter.now = date;
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
