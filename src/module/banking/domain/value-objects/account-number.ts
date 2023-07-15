export class AccountNumber {
  private constructor(readonly value: string) {}

  static createNumber(number: string) {
    const accountNumber: string = number ?? this.accountNumberGenerator();
    return new AccountNumber(accountNumber);
  }

  private static accountNumberGenerator(): string {
    return Math.random().toString().substring(2, 13);
  }
}
