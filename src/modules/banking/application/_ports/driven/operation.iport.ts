import { Operation } from 'src/modules/banking/domain/operation';

export const OPERATION_PORT = 'IOperationPort';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllOfAccount(accountNumber: string): Promise<Operation[]>;
}
