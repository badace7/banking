import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { ErrorMessage } from './error/operation-message-error';
import { OperationRejectedError } from './error/operation.error';
import { DepositEvent } from './event/deposit.event';

export default class Account extends AggregateRoot {
  public debit(amount: number) {
    if (this.isNotAuthorizedToPerformOperation(amount)) {
      throw new OperationRejectedError(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_BALANCE,
      );
    }

    this._balance -= amount;
  }

  public credit(amount: number) {
    this._balance += amount;
  }

  public deposit(amount: number) {
    this._balance += amount;

    this.addDomainEvent(
      new DepositEvent(this._id, {
        label: 'Deposit',
        amount: amount,
        account: this._id,
      }),
    );
  }

  public get data() {
    return {
      id: this._id,
      number: this._number,
      balance: this._balance,
      user: this._user,
      overdraftFacility: this._overdraftFacility,
    };
  }

  private isNotAuthorizedToPerformOperation(amount: number): boolean {
    return (
      this.isNotAuthorizedWithoutOverdraft(amount) ||
      this.isNotAuthorizedWithOverdraft(amount)
    );
  }

  private isNotAuthorizedWithoutOverdraft(amount: number): boolean {
    return amount > this._balance && this._overdraftFacility === null;
  }

  private isNotAuthorizedWithOverdraft(amount: number): boolean {
    return this._balance + this._overdraftFacility < amount;
  }

  private constructor(
    private _id: string,
    private _number: string,
    private _balance: number,
    private _user: string,
    private _overdraftFacility: number,
  ) {
    super();
  }

  static create(data: Account['data']): Account {
    return new Account(
      data.id,
      data.number,
      data.balance,
      data.user,
      data.overdraftFacility,
    );
  }
}
