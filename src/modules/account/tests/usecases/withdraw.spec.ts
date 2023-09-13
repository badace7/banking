import {
  WithdrawFixture,
  createWithdrawFixture,
} from '../fixtures/withdraw.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { WithdrawCommand } from '../../_write/core/commands/withdraw.command';
import { OperationRejectedError } from '../../_write/core/domain/error/operation.error';

describe('Feature: Withdraw money', () => {
  let uat: WithdrawFixture;

  beforeEach(() => {
    uat = createWithdrawFixture();
  });
  describe('Rule: Withdraw is authorized with sufficient balance', () => {
    test('Jack is authorized to withdraw money', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenJackMakesAWithdraw(new WithdrawCommand('12312312312', 500));
      uat.thenHisBalanceShouldBe(500);
    });

    test('Jack is not authorized to withdraw money cause his balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenJackMakesAWithdraw(new WithdrawCommand('12312312312', 600));
      uat.thenErrorShouldBe(OperationRejectedError);
    });

    test('Jack is not authorized to withdraw money cause the amount is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenJackMakesAWithdraw(new WithdrawCommand('12312312312', 5));
      uat.thenErrorShouldBe(OperationRejectedError);
    });
  });
  describe('Rule: An account with overdraft authorization is authorized to withdraw money with sufficient balance', () => {
    test('Jack is authorized to withdray money with overdraft authorization', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );
      await uat.whenJackMakesAWithdraw(new WithdrawCommand('12312312312', 700));
      uat.thenHisBalanceShouldBe(-200);
    });

    test('Jack is not authorized to withdray money with overdraft authorization cause is balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );
      await uat.whenJackMakesAWithdraw(
        new WithdrawCommand('12312312312', 1100),
      );
      uat.thenErrorShouldBe(OperationRejectedError);
    });
  });
});
