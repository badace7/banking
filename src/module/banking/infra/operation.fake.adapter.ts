import { IOperationPort } from '../application/_ports/operation.iport';
import { Operation } from '../domain/operation';

class FakeOperationRepository implements IOperationPort {
  private fakeOperationEntityManager: Map<string, Operation> = new Map();
  save(operation: Operation): Promise<void> {
    this.fakeOperationEntityManager.set(operation.data.id, operation);
    return Promise.resolve();
  }
  getAllOfCustomer(accountNumber: string): Promise<Operation[]> {
    return Promise.resolve(
      [...this.fakeOperationEntityManager.values()]
        .filter(
          (trn) =>
            trn.data.origin === accountNumber ||
            trn.data.destination === accountNumber,
        )
        .map((t) =>
          Operation.create({
            id: t.data.id,
            label: t.data.label,
            amount: t.data.amount,
            origin: t.data.origin,
            destination: t.data.destination,
            type: t.data.type,
            date: t.data.date,
          }),
        ),
    );
  }
  async findOperation(id: string): Promise<Operation> {
    return this.fakeOperationEntityManager.get(id);
  }
}

export default FakeOperationRepository;
