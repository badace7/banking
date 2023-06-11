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
    this.transactionManager._transaction = transaction;
  }

  private get number(): string {
    return this.props.number.value;
  }

  private get customer(): string {
    return this.props.customer;
  }

  private get balance(): number {
    return this.props.balance.amount;
  }

  private get overdraftFacility(): number {
    return this.props.overdraftFacility.value.amount;
  }

  get data() {
    return {
      number: this.number,
      balance: this.balance,
      customer: this.customer,
      overdraftFacility: this.overdraftFacility,
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
        overdraftFacility: OverdraftFacility.create(
          Money.create(data.overdraftFacility),
        ),
      },
      id,
    );
  }
}
