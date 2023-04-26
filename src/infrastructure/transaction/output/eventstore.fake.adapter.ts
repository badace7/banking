import { IEventPort } from 'src/core/account/application/_ports/transaction.iport';
import { IEvent } from 'src/libs/domain/domain.ievent';

class FakeEventStorDBAdapter implements IEventPort {
  private fakeTransactionEntityManager: Map<string, IEvent[]> = new Map();

  async getAll(streamName: string): Promise<IEvent[]> {
    return await this.fakeTransactionEntityManager.get(streamName);
  }

  async save(transactionEvents: IEvent[], accountId: string): Promise<void> {
    await this.fakeTransactionEntityManager.set(
      accountId,
      transactionEvents as any,
    );
  }
}
export default FakeEventStorDBAdapter;
