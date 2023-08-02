import { OperationRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';
import { WithdrawCommand } from 'src/modules/banking/application/commands/withdraw.command';
import {
  FlowIndicator,
  OperationType,
} from 'src/modules/banking/domain/operation';
import {
  WithdrawFixture,
  createWithdrawFixture,
} from '../fixtures/withdraw.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { OperationBuilder } from '../builders/operation.builder';

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
      uat.andJackWantsToWithdrawMoneyNow(new Date('2023-07-15T19:00:00.000Z'));
      await uat.whenJackMakesAWithdraw(
        new WithdrawCommand('withdraw-id', '12312312312', 500),
      );
      uat.thenHisBalanceShouldBe(500);
      await uat.AndTransferOperationShouldBeRecorded(
        OperationBuilder()
          .withId('withdraw-id')
          .withAccount('12312312312')
          .withLabel('Withdraw')
          .withAmount(500)
          .withType(OperationType.WITHDRAW)
          .withFlow(FlowIndicator.DEBIT)
          .build(),
      );
    });

    test('Jack is not authorized to withdraw money cause his balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(500)
          .ownerId('jack-id')
          .build(),
      );
      uat.andJackWantsToWithdrawMoneyNow(new Date('2023-07-15T19:00:00.000Z'));
      await uat.whenJackMakesAWithdraw(
        new WithdrawCommand('withdraw-id', '12312312312', 600),
      );
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
      uat.andJackWantsToWithdrawMoneyNow(new Date('2023-07-15T19:00:00.000Z'));
      await uat.whenJackMakesAWithdraw(
        new WithdrawCommand('withdraw-id', '12312312312', 700),
      );
      uat.thenHisBalanceShouldBe(-200);
      await uat.AndTransferOperationShouldBeRecorded(
        OperationBuilder()
          .withId('withdraw-id')
          .withAccount('12312312312')
          .withLabel('Withdraw')
          .withAmount(700)
          .withType(OperationType.WITHDRAW)
          .withFlow(FlowIndicator.DEBIT)
          .build(),
      );
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
      uat.andJackWantsToWithdrawMoneyNow(new Date('2023-07-15T19:00:00.000Z'));
      await uat.whenJackMakesAWithdraw(
        new WithdrawCommand('withdraw-id', '12312312312', 1100),
      );
      uat.thenErrorShouldBe(OperationRejectedError);
    });
  });
});
