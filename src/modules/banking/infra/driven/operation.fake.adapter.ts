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
        .filter((trn) => trn.data.account === accountNumber)
        .map((t) =>
          Operation.create({
            id: t.data.id,
            label: t.data.label,
            amount: t.data.amount,
            account: t.data.account,
            type: t.data.type,
            flow: t.data.flow,
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
