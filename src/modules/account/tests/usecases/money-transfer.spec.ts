import {
  TransferFixture,
  createTransferFixture,
} from '../fixtures/money-transfer.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { MoneyTransferCommand } from '../../_write/core/commands/transfer.command';
import { OperationRejectedError } from '../../_write/core/domain/error/operation.error';

describe('Feature: Money transfer between two customers', () => {
  let uat: TransferFixture;

  beforeEach(() => {
    uat = createTransferFixture();
  });

  describe('Rule: A money transfer is authorized with sufficient balance', () => {
    test('Jack is authorized to make a money transfer', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withId('jack-account-id')
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withId('bob-account-id')
          .withAccountNumber('98797897897')
          .withBalance(1000)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          "Participation in Anna's gift",
          1000,
          '12312312312',
          '98797897897',
        ),
      );

      await uat.thenJackBalanceShouldBe(0);
      await uat.AndBobBalanceShouldBe(2000);
    });
    test('Jack is not authorized to make a money transfer cause his balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withId('jack-account-id')
          .withAccountNumber('12312312312')
          .withBalance(2500)
          .ownerId('jack-id')
          .build(),
      );

      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withId('bob-account-id')
          .withAccountNumber('98797897897')
          .withBalance(-500)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'Car accident',
          3000,
          '12312312312',
          '98797897897',
        ),
      );

      uat.thenErrorShouldBe(OperationRejectedError);
    });
  });

  describe('Rule: An account with overdraft authorization is authorized to made a money transfer with sufficient balance', () => {
    test('Jack is authorized to make a money transfer with overdraft authorization', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withId('jack-account-id')
          .withAccountNumber('12312312312')
          .withBalance(2000)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );

      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withId('bob-account-id')
          .withAccountNumber('98797897897')
          .withBalance(0)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'Spain holiday',
          2500,
          '12312312312',
          '98797897897',
        ),
      );

      await uat.thenJackBalanceShouldBe(-500);

      await uat.AndBobBalanceShouldBe(2500);
    });
    test('Jack is not authorized to make a money transfer with overdraft authorization cause is balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withId('jack-account-id')
          .withAccountNumber('12312312312')
          .withBalance(-500)
          .ownerId('jack-id')
          .build(),
      );

      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withId('bob-account-id')
          .withAccountNumber('98797897897')
          .withBalance(2500)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'Car accident',
          100,
          '12312312312',
          '98797897897',
        ),
      );

      uat.thenErrorShouldBe(OperationRejectedError);
    });
  });
});
