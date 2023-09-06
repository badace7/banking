import { FlowIndicator } from 'src/modules/banking/domain/flow-indicator';
import { Operation } from 'src/modules/banking/domain/operation';
import { OperationType } from 'src/modules/banking/domain/operation-type';

export const OPERATION_PORT = 'IOperationPort';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllByAccountNumber(accountNumber: string): Promise<Operation[]>;
  getOperationTypeById(id: number): Promise<OperationType>;
  getFlowIndicatorById(id: number): Promise<FlowIndicator>;
}
