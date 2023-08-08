import { WithdrawCommand } from 'src/modules/banking/application/commands/withdraw.command';

import {
  FlowIndicator,
  OperationType,
} from 'src/modules/banking/domain/operation';
import {
  DepositFixture,
  createDepositFixture,
} from '../fixtures/deposit.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { OperationBuilder } from '../builders/operation.builder';

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
      uat.andJackWantsToDepositMoneyNow(new Date('2023-07-15T19:00:00.000Z'));
      await uat.whenJackDepositMoney(
        new WithdrawCommand('deposit-id', '12312312312', 500),
      );
      uat.thenHisBalanceShouldBe(1500);
      await uat.AndTransferOperationShouldBeRecorded(
        OperationBuilder()
          .withId('deposit-id-2')
          .withAccount('12312312312')
          .withLabel('Deposit')
          .withAmount(500)
          .withType(OperationType.DEPOSIT)
          .withFlow(FlowIndicator.CREDIT)
          .build(),
      );
    });
  });
});
