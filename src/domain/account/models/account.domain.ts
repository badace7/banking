import { Entity } from 'src/libs/domain/Entity';

export type AccountProperties = {
  number: string;
  balance: number;
  customer: string;
  overdraftAuthorization?: number;
};

class AccountDomain extends Entity<AccountProperties> {
  debitAmount(amount: number): void {
    if (!this.hasOverdraftAuthorization()) {
      this.checkIfBalancePermitOperation(amount);
      this.properties.balance -= amount;
      return;
    }
    this.checkIfAllowToPerformOperationWithOverdraft(amount);
    this.properties.balance = this.properties.balance - amount;
  }

  creditAmount(amount: number): void {
    this.properties.balance += amount;
  }

  transferTo(accountAtReception: AccountDomain, amount: number): void {
    this.debitAmount(amount);
    accountAtReception.creditAmount(amount);
  }

  getNumber(): string {
    return this.properties.number;
  }

  getCustomer(): string {
    return this.properties.customer;
  }

  getBalance(): number {
    return this.properties.balance;
  }

  private constructor(properties: AccountProperties, id?: string) {
    super(properties, id);
  }

  private checkIfBalancePermitOperation(amount: number): void {
    if (amount > this.properties.balance) {
      throw new Error(
        `You cannot make this transfer because your balance is insufficient`,
      );
    }
  }

  private checkIfAllowToPerformOperationWithOverdraft(amount: number): void {
    if (
      this.properties.overdraftAuthorization + this.properties.balance <
      amount
    ) {
      throw new Error(
        'your overdraft authorization does not allow you to perform this operation',
      );
    }
  }

  private hasOverdraftAuthorization(): boolean {
    return !this.properties.overdraftAuthorization ? false : true;
  }

  private static accountNumberGenerator(): string {
    return Math.random().toString().substring(2, 13);
  }

  static create(account: AccountProperties): AccountDomain {
    account.number = account.number ?? this.accountNumberGenerator();
    account.overdraftAuthorization = account.overdraftAuthorization ?? null;
    return new AccountDomain(account);
  }
}

export default AccountDomain;
