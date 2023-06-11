export abstract class Transaction {
  constructor(
    readonly amount: number,
    readonly date: Date = new Date(),
    readonly label?: string,
    readonly from?: string,
  ) {}
}
