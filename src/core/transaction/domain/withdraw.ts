import { Transaction } from './transaction';

export class WithdrawTransaction extends Transaction {
  readonly _type: string = 'WITHDRAW';
  private constructor(readonly amount: number, readonly date: Date) {
    super(amount, date);
  }
  static create(amount: number): WithdrawTransaction {
    return new WithdrawTransaction(amount, new Date());
  }
}
