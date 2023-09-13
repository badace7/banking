import {
  DepositFixture,
  createDepositFixture,
} from '../fixtures/deposit.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { DepositCommand } from '../../_write/core/commands/deposit.command';
import { OperationRejectedError } from '../../_write/core/domain/error/operation.error';

describe('Feature: Deposit money', () => {
  let uat: DepositFixture;

  beforeEach(() => {
    uat = createDepositFixture();
  });
  describe('Rule: Deposit is authorized', () => {
    test('Jack is authorized to deposit money', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenJackDepositMoney(new DepositCommand('12312312312', 500));
      uat.thenHisBalanceShouldBe(1500);
    });
  });

  describe('Rule: Deposit is not authorized', () => {
    test('Jack is not authorized to deposit money cause the amount is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      await uat.whenJackDepositMoney(new DepositCommand('12312312312', 5));
      uat.thenErrorShouldBe(OperationRejectedError);
    });
  });
});
