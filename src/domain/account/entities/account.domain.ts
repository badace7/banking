import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/exceptions/Result';

type AccountProperties = {
  id?: string;
  number: string;
  balance: number;
  customer: string;
};

class AccountDomain extends Entity {
  private number: string;
  private balance: number;
  private customer: string;

  debitAmount(amount: number): Result<string> {
    if (this.balance === 0 || amount > this.balance) {
      return Result.fail<string>(
        `You cannot make this transfer because your balance is insufficient`,
      );
    }
    this.balance -= amount;

    if (this.balance === 0) {
      return Result.ok<string>(`be careful your balance has reached 0`);
    }

    return Result.ok<string>(`Your Account has been debited successfully`);
  }

  creditAmount(amount: number): void {
    this.balance += amount;
  }

  getNumber(): string {
    return this.number;
  }

  getCustomer(): string {
    return this.customer;
  }

  getBalance(): number {
    return this.balance;
  }

  private constructor({ id, number, balance, customer }: AccountProperties) {
    super(id);
    this.number = number ?? this.accountNumberGenerator();
    this.balance = balance;
    this.customer = customer;
  }

  private accountNumberGenerator(): string {
    return Math.random().toString().substring(2, 13);
  }

  private setBalance(balance: number): void {
    this.balance = balance;
  }

  static create(account: AccountProperties): AccountDomain {
    return new AccountDomain(account);
  }
}

export default AccountDomain;
