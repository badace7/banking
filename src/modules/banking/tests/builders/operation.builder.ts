import {
  FlowIndicator,
  Operation,
  OperationType,
} from 'src/modules/banking/domain/operation';

export const OperationBuilder = ({
  id = 'operation-id',
  label = 'label',
  amount = 1000,
  account = '12312312312',
  type = null,
  flow = null,
  date = new Date('2023-07-15T19:00:00.000Z'),
}: {
  id?: string;
  label?: string;
  amount?: number;
  account?: string;
  type?: OperationType;
  flow?: FlowIndicator;
  date?: Date;
} = {}) => {
  const props = { id, label, amount, account, type, flow, date };
  return {
    withId(_id: string) {
      return OperationBuilder({
        ...props,
        id: _id,
      });
    },
    withLabel(_label: string) {
      return OperationBuilder({
        ...props,
        label: _label,
      });
    },
    withAmount(_amount: number) {
      return OperationBuilder({
        ...props,
        amount: _amount,
      });
    },
    withAccountId(_origin: string) {
      return OperationBuilder({
        ...props,
        account: _origin,
      });
    },
    withType(_type: OperationType) {
      return OperationBuilder({
        ...props,
        type: _type,
      });
    },
    withFlow(_flow: FlowIndicator) {
      return OperationBuilder({
        ...props,
        flow: _flow,
      });
    },
    withDate(_date: Date) {
      return OperationBuilder({
        ...props,
        date: _date,
      });
    },
    build(): Operation {
      return Operation.create({
        id: props.id,
        label: props.label,
        amount: props.amount,
        account: props.account,
        type: props.type,
        flow: props.flow,
        date: props.date,
      });
    },
  };
};
