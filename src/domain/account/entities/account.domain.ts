import { Entity } from 'src/libs/domain/Entity';

type AccountProperties = {
  id?: string;
  number: string;
  balance: number;
  customer: string;
  overdraftAuthorization?: number;
};

class AccountDomain extends Entity {
  private number: string;
  private balance: number;
  private customer: string;
  private overdraftAuthorization: number;

  debitAmount(amount: number): void {
    if (this.hasOverdraftAuthorization()) {
      this.checkIfAllowToPerformOperationWithOverdraft(amount);
      this.balance = this.balance - amount;
      return;
    }
    this.checkIfBalancePermitOperation(amount);
    this.balance -= amount;
  }

  creditAmount(amount: number): void {
    this.balance += amount;
  }

  transferTo(accountAtReception: AccountDomain, amount: number): void {
    this.debitAmount(amount);
    accountAtReception.creditAmount(amount);
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

  private constructor({
    id,
    number,
    balance,
    customer,
    overdraftAuthorization,
  }: AccountProperties) {
    super(id);
    this.number = number ?? this.accountNumberGenerator();
    this.balance = balance;
    this.customer = customer;
    this.overdraftAuthorization = overdraftAuthorization ?? null;
  }

  private checkIfBalancePermitOperation(amount: number): void {
    if (amount > this.balance) {
      throw new Error(
        `You cannot make this transfer because your balance is insufficient`,
      );
    }
  }

  private checkIfAllowToPerformOperationWithOverdraft(amount: number): void {
    if (this.overdraftAuthorization + this.balance < amount) {
      throw new Error(
        'your overdraft authorization does not allow you to perform this operation',
      );
    }
  }

  private hasOverdraftAuthorization(): boolean {
    return !this.overdraftAuthorization ? false : true;
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
