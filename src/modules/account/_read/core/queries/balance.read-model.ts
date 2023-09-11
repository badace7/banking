export class BalanceReadModel {
  constructor(
    private readonly _accountNumber: string,
    private readonly _balance: string,
    private readonly _date: string,
  ) {}

  get data() {
    return {
      accountNumber: this._accountNumber,
      balance: this._balance,
      date: this._date,
    };
  }

  static create(data: {
    accountNumber: string;
    balance: number;
    date: string;
  }) {
    return new BalanceReadModel(
      data.accountNumber,
      String(data.balance),
      data.date,
    );
  }
}
