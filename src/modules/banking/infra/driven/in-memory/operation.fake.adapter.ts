import { IOperationPort } from '../../../application/_ports/repositories/operation.iport';
import { Operation } from '../../../domain/operation';

class FakeOperationRepository implements IOperationPort {
  getAllByAccountNumber(accountNumber: string): Promise<Operation[]> {
    throw new Error('Method not implemented.');
  }

  private fakeOperationEntityManager: Map<string, Operation> = new Map();
  save(operation: Operation): Promise<void> {
    this.fakeOperationEntityManager.set(operation.data.id, operation);
    return Promise.resolve();
  }
  getAllOfAccount(id: string): Promise<Operation[]> {
    return Promise.resolve(
      [...this.fakeOperationEntityManager.values()].filter(
        (operation) => operation.data.account === id,
      ),
    );
  }
  findOperation(id: string): Promise<Operation> {
    return Promise.resolve(this.fakeOperationEntityManager.get(id));
  }
}

export default FakeOperationRepository;
