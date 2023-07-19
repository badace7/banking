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
    private readonly _origin: string,
    private readonly _destination: string,
    private readonly _type: OperationType,
    private readonly _date: Date,
  ) {}

  get data() {
    return {
      id: this._id,
      label: this._label,
      amount: this._amount,
      origin: this._origin,
      destination: this._destination,
      type: this._type,
      date: this._date,
    };
  }

  static create(operation: Operation['data']) {
    if (operation.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    return new Operation(
      operation.id,
      operation.label,
      operation.amount,
      operation.origin,
      operation.destination,
      operation.type,
      operation.date,
    );
  }
}
