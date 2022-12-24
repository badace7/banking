import { Entity } from '../../../core/domain/Entity';

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
  private constructor({ id, number, balance, customer }: AccountProperties) {
    super(id);
    this.number = number ?? this.accountNumberGenerator();
    this.balance = balance;
    this.customer = customer;
  }

  public debitAmount(amount: number): void {
    if (this.balance <= 0) {
      throw new Error(
        'You cannot make this transfer because your balance is insufficient',
      );
    }
    this.balance -= amount;
  }

  public creditAmount(amount: number): void {
    this.balance += amount;
  }

  private accountNumberGenerator(): string {
    return Math.random().toString().substring(2, 13);
  }

  public getNumber(): string {
    return this.number;
  }

  private getBalance(): number {
    return this.balance;
  }

  private setBalance(balance: number): void {
    this.balance = balance;
  }
  public getCustomer(): string {
    return this.customer;
  }

  static create(account: AccountProperties): AccountDomain {
    return new AccountDomain(account);
  }
}

export default AccountDomain;
