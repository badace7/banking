import { MoneyTransferCommand } from 'src/core/transaction/application/commands/transfer.command';
import {
  createTransferFixture,
  TransferFixture,
} from '../fixtures/money-transfer.fixture';
import { AccountBuilder } from '../builders/account.builder';
import { TransactionRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';

describe('Feature: Money transfer', () => {
  let uat: TransferFixture;

  beforeEach(() => {
    uat = createTransferFixture();
  });

  describe('Rule: A money transfer is authorized with sufficient balance', () => {
    test('Jack is authorized to make a money transfer', async () => {
      uat.givenTheFollowingCustomerThatWantToMakeMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(1000)
          .ownerId('jack-id')
          .build(),
      );

      uat.andTheFollowingCustomerThatWantToReceiveMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(1000)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenCustomerMakesAmoneyTransfer(
        new MoneyTransferCommand({
          label: "Participation in Anna's gift",
          amount: 1000,
          from: '12312312312',
          to: '98797897897',
        }),
      );

      await uat.thenTheBalanceOfAccountAtTheOriginOfTransferShouldBe(0);

      await uat.AndTheBalanceOfAccountAtTheReceptionOfTransferShouldBe(2000);
    });
    test('Jack is not authorized to make a money transfer cause his balance is insufficient', async () => {
      uat.givenTheFollowingCustomerThatWantToMakeMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(2500)
          .ownerId('jack-id')
          .build(),
      );

      uat.andTheFollowingCustomerThatWantToReceiveMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(-500)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenCustomerMakesAmoneyTransfer(
        new MoneyTransferCommand({
          label: 'Car accident',
          amount: 3000,
          from: '12312312312',
          to: '98797897897',
        }),
      );

      uat.thenErrorShouldBe(TransactionRejectedError);
    });
  });

  describe('Rule: An account with overdraft authorization is authorized to made a money transfer with sufficient balance', () => {
    test('Jack is authorized to make a money transfer with overdraft authorization', async () => {
      uat.givenTheFollowingCustomerThatWantToMakeMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(2000)
          .ownerId('jack-id')
          .withOverDraftFacility(500)
          .build(),
      );

      uat.andTheFollowingCustomerThatWantToReceiveMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(0)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenCustomerMakesAmoneyTransfer(
        new MoneyTransferCommand({
          label: 'Spain holiday',
          amount: 2500,
          from: '12312312312',
          to: '98797897897',
        }),
      );

      await uat.thenTheBalanceOfAccountAtTheOriginOfTransferShouldBe(-500);

      await uat.AndTheBalanceOfAccountAtTheReceptionOfTransferShouldBe(2500);
    });
    test('Jack is not authorized to make a money transfer with overdraft authorization cause is balance is insufficient', async () => {
      uat.givenTheFollowingCustomerThatWantToMakeMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('12312312312')
          .withBalance(-500)
          .ownerId('jack-id')
          .build(),
      );

      uat.andTheFollowingCustomerThatWantToReceiveMoneyTransfer(
        AccountBuilder()
          .withAccountNumber('98797897897')
          .withBalance(2500)
          .ownerId('bob-id')
          .build(),
      );

      await uat.whenCustomerMakesAmoneyTransfer(
        new MoneyTransferCommand({
          label: 'Car accident',
          amount: 100,
          from: '12312312312',
          to: '98797897897',
        }),
      );

      uat.thenErrorShouldBe(TransactionRejectedError);
    });
  });
});
