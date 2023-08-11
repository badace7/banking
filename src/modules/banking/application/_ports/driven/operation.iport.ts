import { Operation } from 'src/modules/banking/domain/operation';
import { OperationReadModel } from '../../queries/operations.read-model';

export const OPERATION_PORT = 'IOperationPort';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllOfAccount(accountNumber: string): Promise<Operation[]>;
  getAllByAccountNumber(accountNumber: string): Promise<OperationReadModel[]>;
}
