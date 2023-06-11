type TransferCommandProps = {
  label: string;
  amount: number;
  from: string;
  to: string;
};

export class MoneyTransferCommand {
  public readonly label: string;
  public readonly amount: number;
  public readonly from: string;
  public readonly to: string;
  public readonly date: Date;

  constructor({ label, amount, from, to }: TransferCommandProps) {
    this.label = label;
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.date = new Date();
  }
}
