import { Operation } from 'src/modules/operation/domain/operation';
import { DepositCommand } from '../../application/commands/deposit.command';
import { Deposit } from '../../application/commands/deposit.usecase';
import Account from '../../domain/account';
import FakeAccountRepository from '../../infra/driven/in-memory/account.fake.adapter';
import { FakeDateAdapter } from '../../infra/driven/in-memory/date-provider.fake.adapter';
import FakeOperationRepository from '../../infra/driven/in-memory/operation.fake.adapter';

export const createDepositFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const operationRepository = new FakeOperationRepository();
  const dateAdapter = new FakeDateAdapter();

  const depositUsecase = new Deposit(accountRepository, null);

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
