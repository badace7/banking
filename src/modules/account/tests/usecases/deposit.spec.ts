import {
  DepositFixture,
  createDepositFixture,
} from '../fixtures/deposit.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { WithdrawCommand } from '../../application/commands/withdraw.command';

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
      await uat.whenJackDepositMoney(
        new WithdrawCommand('deposit-id', '12312312312', 500),
      );
      uat.thenHisBalanceShouldBe(1500);
    });
  });
});
