type WithdrawCommandProps = {
  from: string;
  amount: number;
};

export class WithdrawCommand {
  public readonly from: string;
  public readonly amount: number;
  public readonly date: Date;

  constructor({ from, amount }: WithdrawCommandProps) {
    this.amount = amount;
    this.from = from;
    this.date = new Date();
  }
}
