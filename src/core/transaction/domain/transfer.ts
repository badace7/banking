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
    readonly label: string,
    readonly amount: number,
    readonly from: string,
    readonly to: string,
    readonly date: Date,
  ) {
    super(amount, date, label);
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
