export class WithdrawCommand {
  constructor(public readonly origin: string, public readonly amount: number) {}
}
