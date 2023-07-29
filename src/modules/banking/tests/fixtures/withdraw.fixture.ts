import { Withdraw } from 'src/modules/banking/application/commands/withdraw.usecase';
import Account from 'src/modules/banking/domain/account';
import { WithdrawCommand } from 'src/modules/banking/application/commands/withdraw.command';
import { Operation } from 'src/modules/banking/domain/operation';
import FakeAccountRepository from '../../infra/driven/account.fake.adapter';
import FakeOperationRepository from '../../infra/driven/operation.fake.adapter';
import { StubDateProvider } from '../../infra/driven/date-provider.fake.adapter';

export const createWithdrawFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const operationRepository = new FakeOperationRepository();
  const dateProvider = new StubDateProvider();
  const withdrawUsecase = new Withdraw(
    accountRepository,
    operationRepository,
    dateProvider,
  );

  let accountToDebit: Account;

  let thrownError: Error;

  return {
    givenJackHasABankAccount(account: Account) {
      accountToDebit = account;
      accountRepository.saveBankAccount(account);
    },
    andJackWantsToWithdrawMoneyNow(date: Date) {
      dateProvider.now = date;
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
    async AndTransferOperationShouldBeRecorded(expectedOperation: Operation) {
      const operations = await operationRepository.getAllOfCustomer(
        accountToDebit.data.number,
      );
      expect(operations).toContainEqual(expectedOperation);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type WithdrawFixture = ReturnType<typeof createWithdrawFixture>;
