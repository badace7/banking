export class Money {
  private constructor(
    readonly amount: number,
    readonly currency: string = '€',
  ) {}

  add(amount: number): Money {
    return new Money(this.amount + amount);
  }

  substract(money: number): Money {
    return new Money(this.amount - money);
  }

  // isGreaterThan(money: Money): boolean {
  //   return this.amount > money.amount;
  // }

  isLessThan(money: number) {
    return this.amount < money;
  }

  showAmount() {
    return `${this.amount} ${this.currency}`;
  }

  static create(amount: number) {
    return new Money(amount);
  }
}
