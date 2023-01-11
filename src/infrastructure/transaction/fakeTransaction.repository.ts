import { ITransactionRepository } from '../../domain/account/_ports/output/transaction.irepository';
import TransferDomain from '../../domain/account/models/transfer.domain';

class FakeTransactionRepository implements ITransactionRepository {
  private fakeTransactionEntityManager: Map<string, TransferDomain>;

  constructor(transaction?: TransferDomain) {
    this.fakeTransactionEntityManager = new Map<string, TransferDomain>([
      [transaction?.getId(), transaction],
    ]);
  }
  async findTransaction(transactionId: string): Promise<TransferDomain> {
    return this.fakeTransactionEntityManager.get(transactionId);
  }
  async saveTransaction(transaction: TransferDomain): Promise<TransferDomain> {
    this.fakeTransactionEntityManager.set(
      transaction.getId(),
      transaction.properties as any,
    );

    return this.fakeTransactionEntityManager.get(transaction.getId());
  }
  async getAll(): Promise<TransferDomain[]> {
    return Array.from(this.fakeTransactionEntityManager.values());
  }
}
export default FakeTransactionRepository;
