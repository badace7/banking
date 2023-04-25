import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { CreditEvent } from '../application/events/credit.event';
import { DebitEvent } from '../application/events/debit.event';
import TransferDomain from './transfer.domain';

export type AccountProperties = {
  number: string;
  balance: number;
  customer: string;
  overdraftFacility?: number;
};

class AccountDomain extends AggregateRoot<AccountProperties> {
  debitAmount(origin: string, amount: number, label?: string): void {
    if (this.isNotAuthorizedToPerformOperation(amount)) {
      throw new Error(
        `You cannot make this transaction because your balance is insufficient`,
      );
    }
    this.properties.balance -= amount;

    const debitEvent = new DebitEvent({
      from: origin,
      amount,
      label,
    });

    this.addDomainEvent(debitEvent);
  }

  creditAmount(origin: string, amount: number, label?: string): void {
    this.properties.balance += amount;

    const creditEvent = new CreditEvent({
      from: origin,
      amount,
      label,
    });

    this.addDomainEvent(creditEvent);
  }

  transferTo(
    accountAtReception: AccountDomain,
    transferTransaction: TransferDomain,
  ): void {
    this.debitAmount(
      accountAtReception.getNumber(),
      transferTransaction.getAmount(),
      transferTransaction.getLabel(),
    );
    accountAtReception.creditAmount(
      this.getNumber(),
      transferTransaction.getAmount(),
      transferTransaction.getLabel(),
    );
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

  getOverdraftFacility(): number {
    return this.properties.overdraftFacility;
  }

  private constructor(properties: AccountProperties, id?: string) {
    super(properties, id);
  }

  static create(account: AccountProperties, id?: string): AccountDomain {
    account.number = account.number ?? this.accountNumberGenerator();
    account.overdraftFacility = account.overdraftFacility ?? null;
    return new AccountDomain(account, id);
  }
}

export default AccountDomain;
