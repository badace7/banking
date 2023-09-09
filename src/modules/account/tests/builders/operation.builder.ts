import { FlowIndicator } from 'src/modules/operation/core/domain/flow-indicator';
import {
  OperationTypeEnum,
  FlowIndicatorEnum,
  Operation,
} from 'src/modules/operation/core/domain/operation';
import { OperationType } from 'src/modules/operation/core/domain/operation-type';

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
    withType(_type: OperationTypeEnum) {
      return OperationBuilder({
        ...props,
        type: getOperationType(_type),
      });
    },
    withFlow(_flow: FlowIndicatorEnum) {
      return OperationBuilder({
        ...props,
        flow: getFlowIndicatorType(_flow),
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

function getOperationType(value: number) {
  const operationTypes: any = {
    1: new OperationType(1, 'WITHDRAW'),
    2: new OperationType(2, 'DEPOSIT'),
    3: new OperationType(3, 'TRANSFER'),
  };

  return operationTypes[value];
}

function getFlowIndicatorType(value: number) {
  const flowIndicators: any = {
    1: new FlowIndicator(1, 'DEBIT'),
    2: new FlowIndicator(2, 'CREDIT'),
  };

  return flowIndicators[value];
}
