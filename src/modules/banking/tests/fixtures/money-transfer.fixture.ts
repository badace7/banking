import FakeAccountRepository from 'src/modules/banking/infra/account.fake.adapter';
import FakeOperationRepository from 'src/modules/banking/infra/operation.fake.adapter';
import { MoneyTransfer } from 'src/modules/banking/application/commands/moneytransfer.usecase';
import { StubDateProvider } from 'src/modules/banking/infra/date-provider.fake.adapter';
import Account from 'src/modules/banking/domain/account';
import { MoneyTransferCommand } from 'src/modules/banking/application/commands/transfer.command';
import { Operation } from 'src/modules/banking/domain/operation';

export const createTransferFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const operationRepository = new FakeOperationRepository();
  const dateProvider = new StubDateProvider();
  const moneyTransferUsecase = new MoneyTransfer(
    accountRepository,
    operationRepository,
    dateProvider,
  );

  let accountAtOrigin: Account;
  let accountAtReception: Account;

  let thrownError: Error;

  return {
    givenJackHasABankAccount(account: Account) {
      accountAtOrigin = account;
      accountRepository.saveBankAccount(account);
    },
    andJackWantsToMakeAmoneyTransferNow(date: Date) {
      dateProvider.now = date;
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
      const operations = await operationRepository.getAllOfCustomer(
        accountAtOrigin.data.number,
      );
      expect(operations).toContainEqual(expectedOperation);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type TransferFixture = ReturnType<typeof createTransferFixture>;
