export class Money {
  private constructor(
    readonly amount: number,
    readonly currency: string = '€',
  ) {}

  add(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  substract(money: Money): Money {
    return new Money(this.amount - money.amount);
  }

  isGreaterThan(money: Money): boolean {
    return this.amount > money.amount;
  }

  showAmount() {
    return `${this.amount} ${this.currency}`;
  }

  static create(amount: number) {
    return new Money(amount);
  }
}
