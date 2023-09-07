import { FlowIndicator } from '../../domain/flow-indicator';
import { Operation } from '../../domain/operation';
import { OperationType } from '../../domain/operation-type';

export const OPERATION_PORT = 'IOperationPort';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllByAccountNumber(accountNumber: string): Promise<Operation[]>;
  getOperationTypeById(id: number): Promise<OperationType>;
  getFlowIndicatorById(id: number): Promise<FlowIndicator>;
}
