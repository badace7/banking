import { OperationRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';

export default class Account {
  public debit(amount: number) {
    if (this.isNotAuthorizedToPerformOperation(amount)) {
      throw new OperationRejectedError(
        `You cannot make this operation because your balance is insufficient`,
      );
    }

    this._balance -= amount;
  }

  public credit(amount: number) {
    this._balance += amount;
  }

  public get data() {
    return {
      id: this._id,
      number: this._number,
      balance: this._balance,
      customer: this._customer,
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
    private _customer: string,
    private _overdraftFacility: number,
  ) {}

  static create(data: Account['data']): Account {
    return new Account(
      data.id,
      data.number,
      data.balance,
      data.customer,
      data.overdraftFacility,
    );
  }
}
