import { Transaction } from './transaction';

export class WithdrawTransaction extends Transaction {
  readonly _type: string = 'TRANSFER';
  private constructor(readonly _amount: number, readonly _date: Date) {
    super(_amount, _date);
  }

  get from(): string {
    return this.from;
  }

  get to(): string {
    return this.to;
  }

  static create(amount: number): WithdrawTransaction {
    return new WithdrawTransaction(amount, new Date());
  }
}
