export abstract class Transaction {
  constructor(
    readonly _amount: number,
    readonly _date: Date,
    readonly _label?: string,
    readonly _from?: string,
  ) {}

  get date(): Date {
    return this._date;
  }
  get amount(): number {
    return this._amount;
  }
  get label(): string {
    return this._label;
  }

  get from(): string {
    return this._from;
  }
}
