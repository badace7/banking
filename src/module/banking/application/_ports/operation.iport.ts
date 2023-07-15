import { Operation } from '../../domain/operation';

export interface IOperationPort {
  save(operation: Operation): Promise<void>;
  getAllOfCustomer(accountNumber: string): Promise<Operation[]>;
}
