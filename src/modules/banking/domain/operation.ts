export enum FlowIndicator {
  DEBIT = 1,
  CREDIT = 2,
}

export enum OperationType {
  WITHDRAW = 1,
  DEPOSIT = 2,
  TRANSFER = 3,
}

export class Operation {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _amount: number,
    private readonly _account: string,
    private readonly _type: OperationType,
    private readonly _flow: FlowIndicator,
    private readonly _date: Date,
  ) {}

  get data() {
    return {
      id: this._id,
      label: this._label,
      amount: this._amount,
      account: this._account,
      type: this._type,
      flow: this._flow,
      date: this._date,
    };
  }

  static create(operation: Operation['data']) {
    return new Operation(
      operation.id,
      operation.label,
      operation.amount,
      operation.account,
      operation.type,
      operation.flow,
      operation.date,
    );
  }
}
