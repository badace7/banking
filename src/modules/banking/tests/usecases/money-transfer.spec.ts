import { OperationRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';
import { createTransferFixture } from '../fixtures/money-transfer.fixture';
import { OperationType } from 'src/modules/banking/domain/operation';
import { MoneyTransferCommand } from 'src/modules/banking/application/commands/transfer.command';
import { TransferFixture } from '../fixtures/money-transfer.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { OperationBuilder } from '../builders/operation.builder';

describe('Feature: Money transfer between two customers', () => {
  let uat: TransferFixture;

  beforeEach(() => {
    uat = createTransferFixture();
  });

  describe('Rule: A money transfer is authorized with sufficient balance', () => {
    test('Jack is authorized to make a money transfer', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );
      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(1000)
          .ownerId('bob-id')
          .build(),
      );

      uat.andJackWantsToMakeAmoneyTransferNow(
        new Date('2023-07-15T19:00:00.000Z'),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'operation-id',
          "Participation in Anna's gift",
          1000,
          '12312312312',
          '98797897897',
        ),
      );

      await uat.thenJackBalanceShouldBe(0);
      await uat.AndBobBalanceShouldBe(2000);
      await uat.AndTransferOperationShouldBeRecorded(
        OperationBuilder()
          .withOrigin('12312312312')
          .withDestination('98797897897')
          .withId('operation-id')
          .withLabel("Participation in Anna's gift")
          .withAmount(1000)
          .withType(OperationType.TRANSFER)
          .build(),
      );
    });
    test('Jack is not authorized to make a money transfer cause his balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(2500)
          .ownerId('jack-id')
          .build(),
      );

      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(-500)
          .ownerId('bob-id')
          .build(),
      );

      uat.andJackWantsToMakeAmoneyTransferNow(
        new Date('2023-07-15T19:00:00.000Z'),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'operation-id',
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
          .withAccountNumber('12312312312')
          .withBalance(2000)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );

      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(0)
          .ownerId('bob-id')
          .build(),
      );

      uat.andJackWantsToMakeAmoneyTransferNow(
        new Date('2023-07-15T19:00:00.000Z'),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'operation-id',
          'Spain holiday',
          2500,
          '12312312312',
          '98797897897',
        ),
      );

      await uat.thenJackBalanceShouldBe(-500);

      await uat.AndBobBalanceShouldBe(2500);
      await uat.AndTransferOperationShouldBeRecorded(
        OperationBuilder()
          .withOrigin('12312312312')
          .withDestination('98797897897')
          .withId('operation-id')
          .withLabel('Spain holiday')
          .withAmount(2500)
          .withType(OperationType.TRANSFER)
          .build(),
      );
    });
    test('Jack is not authorized to make a money transfer with overdraft authorization cause is balance is insufficient', async () => {
      uat.givenJackHasABankAccount(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(-500)
          .ownerId('jack-id')
          .build(),
      );

      uat.andBobHasAbankAccount(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(2500)
          .ownerId('bob-id')
          .build(),
      );

      uat.andJackWantsToMakeAmoneyTransferNow(
        new Date('2023-07-15T19:00:00.000Z'),
      );

      await uat.whenJackMakesAmoneyTransfer(
        new MoneyTransferCommand(
          'operation-id',
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
