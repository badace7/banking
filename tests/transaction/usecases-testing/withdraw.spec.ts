import { AccountBuilder } from '../builders/account.builder';
import { WithdrawCommand } from 'src/core/transaction/application/commands/withdraw.command';
import { TransactionRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';
import {
  WithdrawFixture,
  createWithdrawFixture,
} from '../fixtures/withdraw.fixture';

describe('Feature: Withdraw money', () => {
  let uat: WithdrawFixture;

  beforeEach(() => {
    uat = createWithdrawFixture();
  });
  describe('Rule: Withdraw is authorized with sufficient balance', () => {
    test('Jack is authorized to withdraw money', async () => {
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

    test('Jack is not authorized to withdraw money cause his balance is insufficient', async () => {
      uat.givenTheFollowingCustomerThatWantToWithdrawMoney(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenCustomerMakesAWithdraw(
        new WithdrawCommand({
          from: '12312312312',
          amount: 600,
        }),
      );
      uat.thenErrorShouldBe(TransactionRejectedError);
    });
  });
  describe('Rule: An account with overdraft authorization is authorized to withdraw money with sufficient balance', () => {
    test('Jack is authorized to withdray money with overdraft authorization', async () => {
      uat.givenTheFollowingCustomerThatWantToWithdrawMoney(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );
      await uat.whenCustomerMakesAWithdraw(
        new WithdrawCommand({
          from: '12312312312',
          amount: 700,
        }),
      );
      uat.thenTheBalanceShouldBe(-200);
    });

    test('Jack is not authorized to withdray money with overdraft authorization cause is balance is insufficient', async () => {
      uat.givenTheFollowingCustomerThatWantToWithdrawMoney(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );
      await uat.whenCustomerMakesAWithdraw(
        new WithdrawCommand({
          from: '12312312312',
          amount: 1100,
        }),
      );
      uat.thenErrorShouldBe(TransactionRejectedError);
    });
  });
});
