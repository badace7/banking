export class OperationReadModel {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _debit: number,
    private readonly _credit: number,
    private readonly _type: string,
    private readonly _date: Date,
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
    date: Date;
  }) {
    if (operation.flow === 'DEBIT') {
      return new OperationReadModel(
        operation.id,
        operation.label,
        operation.amount,
        0,
        operation.type,
        operation.date,
      );
    }

    if (operation.flow === 'CREDIT') {
      return new OperationReadModel(
        operation.id,
        operation.label,
        0,
        operation.amount,
        operation.type,
        operation.date,
      );
    }
  }
}
