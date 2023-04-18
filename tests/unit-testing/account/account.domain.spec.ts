import AccountDomain from 'src/core/account/domain/account.domain';
import TransferDomain from 'src/core/account/domain/transfer.domain';

describe('Account domain transfer testing', () => {
  it('should transfer 500€ and return accounts balances', () => {
    //Arrange
    const bobAccount = AccountDomain.create({
      number: '98797897897',
      balance: 1000,
      customer: 'BobId',
    });
    const jackAccount = AccountDomain.create({
      number: '12312312312',
      balance: 1000,
      customer: 'jackId',
    });

    const transaction = TransferDomain.create({
      label: 'remboursement',
      amount: 500,
      from: bobAccount.getNumber(),
      to: jackAccount.getNumber(),
      date: new Date(),
    });

    //Act
    bobAccount.transferTo(jackAccount, transaction);

    //Assert
    expect(bobAccount.getBalance()).toBe(500);
    expect(jackAccount.getBalance()).toBe(1500);
  });

  it('should try to transfer 1500€ and return "You cannot make this transfer because your balance is insufficient"', () => {
    //Arrange
    const bobAccount = AccountDomain.create({
      number: '98797897897',
      balance: 1000,
      customer: 'BobId',
    });
    const jackAccount = AccountDomain.create({
      number: '12312312312',
      balance: 1000,
      customer: 'jackId',
    });

    const transaction = TransferDomain.create({
      label: 'remboursement',
      amount: 1500,
      from: bobAccount.getNumber(),
      to: jackAccount.getNumber(),
      date: new Date(),
    });

    //Act
    const tryAtransfer = () => bobAccount.transferTo(jackAccount, transaction);

    //Assert
    expect(tryAtransfer).toThrow(
      'You cannot make this transaction because your balance is insufficient',
    );
  });

  it('should transfer 700€ with 500€ overdraft authorization and return accounts balances', () => {
    //Arrange
    const bobAccount = AccountDomain.create({
      number: '98797897897',
      balance: 500,
      customer: 'BobId',
      overdraftFacility: 500,
    });
    const jackAccount = AccountDomain.create({
      number: '12312312312',
      balance: 1500,
      customer: 'jackId',
    });
    const transaction = TransferDomain.create({
      label: 'remboursement',
      amount: 700,
      from: bobAccount.getNumber(),
      to: jackAccount.getNumber(),
      date: new Date(),
    });

    //Act
    bobAccount.transferTo(jackAccount, transaction);

    //Assert
    expect(bobAccount.getBalance()).toBe(-200);
    expect(jackAccount.getBalance()).toBe(2200);
  });

  it('should try to transfer 400€ with 300€ remaining overdraft authorization and return "your overdraft authorization does not allow you to perform this operation"', async () => {
    //Arrange
    const bobAccount = AccountDomain.create({
      number: '98797897897',
      balance: -200,
      customer: 'BobId',
      overdraftFacility: 500,
    });
    const jackAccount = AccountDomain.create({
      number: '12312312312',
      balance: 2200,
      customer: 'jackId',
    });

    const transaction = TransferDomain.create({
      label: 'remboursement',
      amount: 400,
      from: bobAccount.getNumber(),
      to: jackAccount.getNumber(),
      date: new Date(),
    });

    //Act
    const tryAtransfer = () => bobAccount.transferTo(jackAccount, transaction);

    //Assert
    expect(tryAtransfer).toThrow(
      'You cannot make this transaction because your balance is insufficient',
    );
  });
});
