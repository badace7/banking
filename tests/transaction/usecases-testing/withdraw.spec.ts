import Account from 'src/core/transaction/domain/account';
import { AccountBuilder } from '../builders/account.builder';
import FakeAccountRepository from 'src/infrastructure/account/output/account.fake.adapter';
import FakeEventStorDBAdapter from 'src/infrastructure/transaction/output/eventstore.fake.adapter';
import { Withdraw } from 'src/core/transaction/application/commands/withdraw.usecase';
import { WithdrawCommand } from 'src/core/transaction/application/commands/withdraw.command';

describe('Feature: Withdraw money', () => {
  describe('Rule: Withdraw is authorized with sufficient balance', () => {
    let uat: WithdrawFixture;

    beforeEach(() => {
      uat = createWithdrawFixture();
    });
    test('Jack is authorized withdraw money', async () => {
      uat.givenTheFollowingCustomerThatWantToWithdrawMoney(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenCustomerMakesAWithdraw(
        new WithdrawCommand({
          from: '12312312312',
          amount: 500,
        }),
      );
      uat.thenTheBalanceShouldBe(500);
    });
  });
});

export const createWithdrawFixture = () => {
  const accountRepository = new FakeAccountRepository();
  const transactionRepository = new FakeEventStorDBAdapter();
  const withdrawUsecase = new Withdraw(
    accountRepository,
    transactionRepository,
  );

  let accountToDebit: Account;

  return {
    givenTheFollowingCustomerThatWantToWithdrawMoney(account: Account) {
      accountToDebit = account;
      accountRepository.saveBankAccount(account);
    },
    async whenCustomerMakesAWithdraw(command: WithdrawCommand) {
      await withdrawUsecase.handle(command);
    },
    async thenTheBalanceShouldBe(expectedBalance: number) {
      const account = await accountRepository.findBankAccount(
        accountToDebit.data.number,
      );

      expect(account.data.balance).toEqual(expectedBalance);
    },
  };
};

export type WithdrawFixture = ReturnType<typeof createWithdrawFixture>;
