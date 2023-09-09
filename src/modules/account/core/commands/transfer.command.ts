export class MoneyTransferCommand {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly amount: number,
    public readonly origin: string,
    public readonly destination: string,
  ) {
    this.id = id;
    this.label = label;
    this.amount = amount;
    this.origin = origin;
    this.destination = destination;
  }
}
