import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { ErrorMessage } from './error/operation-message-error';
import { OperationRejectedError } from './error/operation.error';
import { DepositDoneEvent } from './event/deposit-done.event';
import { WithdrawDoneEvent } from './event/withdraw-done.event';
import { TransferDoneEvent } from './event/transfer-done.event';

export default class Account extends AggregateRoot {
  private DEPOSIT_LIMIT = 5;
  private WITHDRAW_LIMIT = 10;

  public creditBalance(amount: number) {
    this._balance += amount;
  }

  public transferTo(
    account: Account,
    payload: { label: string; amount: number },
  ) {
    if (this._number === account.data.number) {
      throw new OperationRejectedError(
        ErrorMessage.SOURCE_AND_DESTINATION_ACCOUNTS_CANNOT_BE_THE_SAME,
      );
    }

    this.debitBalance(payload.amount);
    account.creditBalance(payload.amount);

    this.addDomainEvent(
      new TransferDoneEvent(this._id, {
        label: payload.label,
        amount: payload.amount,
        originAccount: this._id,
        destinationAccount: account.data.id,
      }),
    );
  }

  public withdraw(amount: number) {
    if (amount < this.WITHDRAW_LIMIT) {
      throw new OperationRejectedError(ErrorMessage.CANNOT_WITHDRAW_UNDER_10);
    }

    this.debitBalance(amount);

    this.addDomainEvent(
      new WithdrawDoneEvent(this._id, {
        label: 'Withdraw',
        amount: amount,
        account: this._id,
      }),
    );
  }

  public deposit(amount: number) {
    if (amount < this.DEPOSIT_LIMIT) {
      throw new OperationRejectedError(ErrorMessage.CANNOT_DEPOSIT_UNDER_5);
    }

    this._balance += amount;

    this.addDomainEvent(
      new DepositDoneEvent(this._id, {
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

  private debitBalance(amount: number) {
    if (this.isNotAuthorizedToPerformOperation(amount)) {
      throw new OperationRejectedError(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_BALANCE,
      );
    }

    this._balance -= amount;
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
