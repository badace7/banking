import { AggregateRoot } from 'src/libs/domain/aggregate.root';

export type AccountProperties = {
  number: string;
  balance: number;
  customer: string;
  overdraftFacility?: number;
};

class AccountDomain extends AggregateRoot<AccountProperties> {
  debitAmount(amount: number): void {
    if (this.isNotAuthorizedToPerformOperation(amount)) {
      throw new Error(
        `You cannot make this transaction because your balance is insufficient`,
      );
    }
    this.properties.balance -= amount;
  }

  creditAmount(amount: number): void {
    this.properties.balance += amount;
  }

  transferTo(accountAtReception: AccountDomain, amount: number): void {
    this.debitAmount(amount);
    accountAtReception.creditAmount(amount);
  }

  private isNotAuthorizedToPerformOperation(amount: number): boolean {
    return (
      this.isNotAuthorizedWithoutOverdraft(amount) ||
      this.isNotAuthorizedWithOverdraft(amount)
    );
  }

  private isNotAuthorizedWithoutOverdraft(amount: number): boolean {
    return (
      amount > this.properties.balance &&
      this.properties.overdraftFacility === null
    );
  }

  private isNotAuthorizedWithOverdraft(amount: number): boolean {
    return amount > this.properties.balance + this.properties.overdraftFacility;
  }

  private static accountNumberGenerator(): string {
    return Math.random().toString().substring(2, 13);
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

  static create(account: AccountProperties): AccountDomain {
    account.number = account.number ?? this.accountNumberGenerator();
    account.overdraftFacility = account.overdraftFacility ?? null;
    return new AccountDomain(account);
  }
}

export default AccountDomain;
