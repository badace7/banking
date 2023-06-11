import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { Transaction } from './transaction';
import { AccountNumber } from './value-objects/account-number';
import { Money } from './value-objects/money';
import { OverdraftFacility } from './value-objects/overdraft-facility';
import { TransactionManager } from './transaction-manager';

export type AccountProperties = {
  number: AccountNumber;
  balance: Money;
  customer: string;
  overdraftFacility: OverdraftFacility;
  transactionToPerform?: Transaction;
};

export default class Account extends AggregateRoot<AccountProperties> {
  private transactionManager = new TransactionManager();

  transferTo(accountAtReception: Account): void {
    this.transactionManager.debitBalance(this);
    this.transactionManager.creditBalance(accountAtReception);
  }

  withdrawMoney() {
    this.transactionManager.debitBalance(this);
  }

  setTransactionToPerform(transaction: Transaction) {
    this.transactionManager.transaction = transaction;
  }

  get data() {
    return {
      number: this.props.number.value,
      balance: this.props.balance.amount,
      customer: this.props.customer,
      overdraftFacility: this.props.overdraftFacility.value,
    };
  }

  private constructor(props: AccountProperties, id?: string) {
    super(props, id);
  }

  static create(data: Account['data'], id?: string): Account {
    data.overdraftFacility = data.overdraftFacility ?? null;
    return new Account(
      {
        number: AccountNumber.createNumber(data.number),
        balance: Money.create(data.balance),
        customer: data.customer,
        overdraftFacility: OverdraftFacility.create(data.overdraftFacility),
      },
      id,
    );
  }
}
