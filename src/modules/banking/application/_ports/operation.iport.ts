import { Operation } from '../../domain/operation';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllOfAccount(accountNumber: string): Promise<Operation[]>;
}
