import { Entity } from '../../../core/domain/Entity';

type TransferTransactionProperties = {
  id?: string;
  amount: number;
  label: string;
  from: string;
  to: string;
};

class TransferTransactionDomain extends Entity {
  private amount: number;
  private label: string;
  private from: string;
  private to: string;
  constructor({ id, amount, label, from, to }: TransferTransactionProperties) {
    super(id);
    this.amount = amount;
    this.label = label;
    this.from = from;
    this.to = to;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getLabel(): string {
    return this.label;
  }

  public getFrom(): string {
    return this.from;
  }

  public getTo(): string {
    return this.to;
  }

  static create(
    transaction: TransferTransactionProperties,
  ): TransferTransactionDomain {
    return new TransferTransactionDomain(transaction);
  }
}

export default TransferTransactionDomain;
