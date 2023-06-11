export abstract class Transaction {
  constructor(
    readonly amount: number,
    readonly date: Date,
    readonly label?: string,
    readonly from?: string,
  ) {}
}
