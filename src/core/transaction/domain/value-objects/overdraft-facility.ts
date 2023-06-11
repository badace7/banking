import { Money } from './money';

export class OverdraftFacility {
  private constructor(readonly value: Money) {}

  isOperationAuthorized(balance: Money, money: Money): boolean {
    return money.isGreaterThan(balance.add(this.value));
  }

  static create(value: Money): OverdraftFacility {
    if (!value) {
      return new OverdraftFacility(null);
    }
    return new OverdraftFacility(value);
  }
}
