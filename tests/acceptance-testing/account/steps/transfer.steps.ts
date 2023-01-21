import { Given, Then, When, Before, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CreateTransferCommand } from 'src/domain/account/commands/transfer.command';
import AccountDomain from 'src/domain/account/models/account.domain';
import { MoneyTransferUsecase } from 'src/domain/account/usecases/commandhandlers/moneytransfer.usecase';
import { IAccountRepository } from 'src/domain/account/_ports/output/account.irepository';
import { ITransactionRepository } from 'src/domain/account/_ports/output/transaction.irepository';
import FakeAccountRepository from 'src/infrastructure/account/fakeRepositories/fakebanking.repository';
import FakeTransactionRepository from 'src/infrastructure/transaction/fakeTransfer.repository';

/**
 * Scenario: A customer wants to transfer money to his friend
 */

let moneyTransferUsecase: MoneyTransferUsecase;
let AccountRepository: IAccountRepository;
let TransactionRepository: ITransactionRepository;

Before(async function () {
  AccountRepository = new FakeAccountRepository();
  TransactionRepository = new FakeTransactionRepository();
});

Given(/^Customers named Jack and Bob$/, function (table: DataTable) {
  this.jack = table.hashes()[0];
  this.bob = table.hashes()[1];
});

Given(
  /^They have a bank account with account numbers as shown below$/,
  function (table: DataTable) {
    this.jackAccount = {
      number: table.hashes()[0].number,
      balance: parseInt(table.hashes()[0].balance),
      customer: table.hashes()[0].id,
    };
    this.bobAccount = {
      number: table.hashes()[1].number,
      balance: parseInt(table.hashes()[1].balance),
      customer: table.hashes()[1].id,
    };

    AccountRepository.saveBankAccount(AccountDomain.create(this.jackAccount));
    AccountRepository.saveBankAccount(AccountDomain.create(this.bobAccount));
  },
);
Given(
  /^Jack wants to do a money transfer in the amount of 1000€ to his friend named Bob has shown below$/,
  function (table: DataTable) {
    table.rowsHash();

    this.input = {
      label: table.rowsHash().label,
      amount: parseInt(table.rowsHash().amount),
      from: table.rowsHash().from,
      to: table.rowsHash().to,
    };

    this.command = new CreateTransferCommand(this.input);
  },
);

When(/^Jack does the money transfer$/, async function () {
  moneyTransferUsecase = new MoneyTransferUsecase(
    AccountRepository,
    TransactionRepository,
  );

  await moneyTransferUsecase.execute(this.command);
});

Then(
  /^Jack's and Bob's balances should be as shown below after receiving the transfer$/,
  async function (table: DataTable) {
    this.jackBalance = parseInt(table.hashes()[0].balance);
    this.bobBalance = parseInt(table.hashes()[1].balance);

    this.jackAccount = await AccountRepository.findBankAccount(
      this.jack.accountNumber,
    );
    this.bobAccount = await AccountRepository.findBankAccount(
      this.bob.accountNumber,
    );

    expect(this.jackAccount.getBalance()).to.equals(this.jackBalance);
    expect(this.bobAccount.getBalance()).to.equals(this.bobBalance);
  },
);
