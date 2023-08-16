import { Operation } from 'src/modules/banking/domain/operation';
import { OperationResult } from '../../queries/operation.result';

export const OPERATION_PORT = 'IOperationPort';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllByAccountNumber(accountNumber: string): Promise<OperationResult[]>;
}
