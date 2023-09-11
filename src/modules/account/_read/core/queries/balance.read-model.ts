export class BalanceReadModel {
  constructor(
    private readonly _accountNumber: string,
    private readonly _balance: string,
  ) {}

  get data() {
    return {
      accountNumber: this._accountNumber,
      balance: this._balance,
    };
  }

  static create(data: { number: string; balance: number }) {
    return new BalanceReadModel(data.number, String(data.balance));
  }
}
