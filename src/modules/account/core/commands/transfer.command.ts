export class MoneyTransferCommand {
  constructor(
    public readonly label: string,
    public readonly amount: number,
    public readonly origin: string,
    public readonly destination: string,
  ) {}
}
