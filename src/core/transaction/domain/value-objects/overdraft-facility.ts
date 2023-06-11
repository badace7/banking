import { Money } from './money';

export class OverdraftFacility {
  private constructor(readonly value: number) {}

  isOperationAuthorized(balance: Money, money: number): boolean {
    return balance.add(this.value).isLessThan(money);
  }

  static create(value: number): OverdraftFacility {
    if (!value) {
      return new OverdraftFacility(null);
    }
    return new OverdraftFacility(value);
  }
}
