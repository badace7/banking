import { ITransactionRepository } from 'src/core/account/application/_ports/output/transaction.irepository';
import TransferDomain from 'src/core/account/domain/transfer.domain';
import { IEvent } from 'src/libs/domain/domain.ievent';

class FakeTransactionRepository implements ITransactionRepository {
  private fakeTransactionEntityManager: Map<string, TransferDomain>;

  constructor(transaction?: TransferDomain) {
    this.fakeTransactionEntityManager = new Map<string, TransferDomain>([
      [transaction?.getId(), transaction],
    ]);
  }
  async saveTransactionEvent(
    transactionEvents: IEvent[],
    accountId: string,
  ): Promise<void> {
    await this.fakeTransactionEntityManager.set(
      accountId,
      transactionEvents as any,
    );
  }
  async findTransactionEvent(transactionId: string): Promise<TransferDomain> {
    return this.fakeTransactionEntityManager.get(transactionId);
  }

  async getAll(): Promise<TransferDomain[]> {
    return Array.from(this.fakeTransactionEntityManager.values());
  }
}
export default FakeTransactionRepository;
