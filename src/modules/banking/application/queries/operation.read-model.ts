export class OperationReadModel {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _debit: string,
    private readonly _credit: string,
    private readonly _type: string,
    private readonly _date: string,
  ) {}

  get data() {
    return {
      id: this._id,
      label: this._label,
      debit: this._debit,
      credit: this._credit,
      type: this._type,
      date: this._date,
    };
  }

  static create(operation: {
    id: string;
    label: string;
    amount: number;
    type: string;
    flow: string;
    date: string;
  }) {
    const ZERO = '';

    if (operation.flow === 'DEBIT') {
      return new OperationReadModel(
        operation.id,
        operation.label,
        `-${operation.amount}`,
        ZERO,
        operation.type,
        operation.date,
      );
    }

    if (operation.flow === 'CREDIT') {
      return new OperationReadModel(
        operation.id,
        operation.label,
        ZERO,
        `+${operation.amount}`,
        operation.type,
        operation.date,
      );
    }
  }
}
