import { Transaction } from './transaction';

export type TransferProperties = {
  label: string;
  amount: number;
  from: string;
  to: string;
  date: Date;
};

export class TransferTransaction extends Transaction {
  readonly _type: string = 'TRANSFER';
  private constructor(
    readonly _label: string,
    readonly _amount: number,
    readonly _from: string,
    readonly _to: string,
    readonly _date: Date,
  ) {
    super(_amount, _date, _label);
  }

  get from(): string {
    return this.from;
  }

  get to(): string {
    return this.to;
  }

  get type(): string {
    return this._type;
  }

  static create(transaction: TransferProperties): TransferTransaction {
    return new TransferTransaction(
      transaction.label,
      transaction.amount,
      transaction.from,
      transaction.to,
      transaction.date,
    );
  }
}

export default TransferTransaction;
