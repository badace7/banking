import { MoneyTransfer } from '../../application/commands/moneytransfer.usecase';
import { MoneyTransferCommand } from '../../application/commands/transfer.command';
import Account from '../../domain/account';
import FakeAccountRepository from '../../infra/driven/in-memory/account.fake.adapter';

import { Operation } from 'src/modules/operation/domain/operation';
import { FakeDateAdapter } from '../../infra/driven/in-memory/date-provider.fake.adapter';
import FakeOperationRepository from 'src/modules/operation/infra/operation.fake.adapter';

export const createTransferFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const operationRepository = new FakeOperationRepository();
  const dateAdapter = new FakeDateAdapter();
  const moneyTransferUsecase = new MoneyTransfer(accountRepository, null);

  let accountAtOrigin: Account;
  let accountAtReception: Account;

  let thrownError: Error;

  return {
    givenJackHasABankAccount(account: Account) {
      accountAtOrigin = account;
      accountRepository.saveBankAccount(account);
    },
    andJackWantsToMakeAmoneyTransferNow(date: Date) {
      dateAdapter.now = date;
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
    async AndTransferOperationShouldBeRecorded(expectedOperation: Operation) {
      const operations = await operationRepository.getAllOfAccount(
        accountAtOrigin.data.id,
      );
      expect(operations).toContainEqual(expectedOperation);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type TransferFixture = ReturnType<typeof createTransferFixture>;
