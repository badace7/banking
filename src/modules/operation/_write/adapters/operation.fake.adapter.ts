import { IOperationPort } from '../core/_ports/operation.iport';
import { FlowIndicator } from '../core/domain/flow-indicator';
import { Operation } from '../core/domain/operation';
import { OperationType } from '../core/domain/operation-type';

class FakeOperationRepository implements IOperationPort {
  private fakeOperationEntityManager: Map<string, Operation> = new Map();
  private fakeOperationTypeEntityManager: Map<number, OperationType> = new Map([
    [1, new OperationType(1, 'WITHDRAW')],
    [2, new OperationType(2, 'DEPOSIT')],
    [3, new OperationType(3, 'TRANSFER')],
  ]);
  private fakeFlowIndicatorEntityManager: Map<number, FlowIndicator> = new Map([
    [1, new FlowIndicator(1, 'DEBIT')],
    [2, new FlowIndicator(2, 'CREDIT')],
  ]);

  getOperationTypeById(id: number): Promise<OperationType> {
    return Promise.resolve(this.fakeOperationTypeEntityManager.get(id));
  }
  getFlowIndicatorById(id: number): Promise<FlowIndicator> {
    return Promise.resolve(this.fakeFlowIndicatorEntityManager.get(id));
  }
  getAllByAccountNumber(accountNumber: string): Promise<Operation[]> {
    throw new Error('Method not implemented.');
  }

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
