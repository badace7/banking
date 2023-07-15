import { Operation, OperationType } from 'src/modules/banking/domain/operation';

export const OperationBuilder = ({
  id = 'operation-id',
  label = 'label',
  amount = 1000,
  origin = '12312312312',
  destination = null,
  type = null,
  date = new Date('2023-07-15T19:00:00.000Z'),
}: {
  id?: string;
  label?: string;
  amount?: number;
  origin?: string;
  destination?: string;
  type?: OperationType;
  date?: Date;
} = {}) => {
  const props = { id, label, amount, origin, destination, type, date };
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
    withOrigin(_origin: string) {
      return OperationBuilder({
        ...props,
        origin: _origin,
      });
    },
    withDestination(_destination: string) {
      return OperationBuilder({
        ...props,
        destination: _destination,
      });
    },
    withType(_type: OperationType) {
      return OperationBuilder({
        ...props,
        type: _type,
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
        origin: props.origin,
        destination: props.destination,
        type: props.type,
        date: props.date,
      });
    },
  };
};
