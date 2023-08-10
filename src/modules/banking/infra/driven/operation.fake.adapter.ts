import { IOperationPort } from '../../application/_ports/driven/operation.iport';
import { Operation } from '../../domain/operation';

class FakeOperationRepository implements IOperationPort {
  private fakeOperationEntityManager: Map<string, Operation> = new Map();
  save(operation: Operation): Promise<void> {
    this.fakeOperationEntityManager.set(operation.data.id, operation);
    return Promise.resolve();
  }
  getAllOfAccount(accountNumber: string): Promise<Operation[]> {
    return Promise.resolve(
      [...this.fakeOperationEntityManager.values()]
        .filter((operation) => operation.data.account === accountNumber)
        .map((operation) =>
          Operation.create({
            id: operation.data.id,
            label: operation.data.label,
            amount: operation.data.amount,
            account: operation.data.account,
            type: operation.data.type,
            flow: operation.data.flow,
            date: operation.data.date,
          }),
        ),
    );
  }
  async findOperation(id: string): Promise<Operation> {
    return this.fakeOperationEntityManager.get(id);
  }
}

export default FakeOperationRepository;
