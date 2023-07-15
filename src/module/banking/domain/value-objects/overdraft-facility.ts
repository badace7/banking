import { Money } from './money';

export class OverdraftFacility {
  private constructor(readonly value: number) {}

  isOperationAuthorized(balance: Money, amount: number): boolean {
    return balance.add(this.value).isLessThan(amount);
  }

  static create(value: number): OverdraftFacility {
    if (!value) {
      return new OverdraftFacility(null);
    }
    return new OverdraftFacility(value);
  }
}
