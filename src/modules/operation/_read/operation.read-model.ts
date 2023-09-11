import { FlowIndicatorEnum } from 'src/modules/operation/_write/core/domain/operation';

export class OperationReadModel {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _debit: string,
    private readonly _credit: string,
    private readonly _type: number,
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
    type: number;
    flow: number;
    date: string;
  }) {
    const ZERO = '0';
    if (operation.flow === FlowIndicatorEnum.DEBIT) {
      return new OperationReadModel(
        operation.id,
        operation.label,
        `-${operation.amount}`,
        ZERO,
        operation.type,
        operation.date,
      );
    }

    if (operation.flow === FlowIndicatorEnum.CREDIT) {
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
