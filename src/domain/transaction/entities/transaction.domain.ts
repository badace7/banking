import AccountDomain from '../../account/entities/account.domain';
import { Result } from '../../../core/exceptions/Result';
import { Entity } from '../../../core/domain/Entity';

type TransferTransactionProperties = {
  id?: string;
  amount: number;
  label: string;
  from: string;
  to: string;
};

class TransferTransactionDomain extends Entity {
  private type: string;
  private amount: number;
  private label: string;
  private date: Date;
  private from: string;
  private to: string;
  private constructor({
    id,
    amount,
    label,
    from,
    to,
  }: TransferTransactionProperties) {
    super(id);
    this.amount = amount;
    this.label = label;
    this.from = from;
    this.to = to;
    this.date = new Date();
  }

  public makeTransfer(
    accountOriginOfTransfer: AccountDomain,
    accountAtReceptionOfTransfer: AccountDomain,
  ): Result<AccountDomain[]> {
    const debitOriginAccountOrError = accountOriginOfTransfer.debitAmount(
      this.amount,
    );

    if (debitOriginAccountOrError.isFailure) {
      return Result.fail<AccountDomain[]>(debitOriginAccountOrError.error);
    }

    accountAtReceptionOfTransfer.creditAmount(this.amount);

    return Result.ok<AccountDomain[]>([
      accountOriginOfTransfer,
      accountAtReceptionOfTransfer,
    ]);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getLabel(): string {
    return this.label;
  }

  public getDate(): Date {
    return this.date;
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
    if (transaction.amount <= 0) {
      throw new Error(
        'You cannot make this transfer because your entered incorrect amount',
      );
    }
    return new TransferTransactionDomain(transaction);
  }
}

export default TransferTransactionDomain;
