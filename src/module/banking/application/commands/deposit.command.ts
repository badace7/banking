export class DepositCommand {
  constructor(
    public readonly id: string,
    public readonly origin: string,
    public readonly amount: number,
  ) {
    this.id = id;
    this.origin = origin;
    this.amount = amount;
  }
}
