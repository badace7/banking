import { ITransactionRepository } from '../../../domain/transaction/_ports/output/transaction.irepository';
import TransferTransactionDomain from '../../../domain/transaction/entities/transaction.domain';

class FakeTransactionRepository implements ITransactionRepository {
  private fakeTransactionEntityManager: Map<string, TransferTransactionDomain>;

  constructor(transaction?: TransferTransactionDomain) {
    this.fakeTransactionEntityManager = new Map<
      string,
      TransferTransactionDomain
    >([[transaction?.getId(), transaction]]);
  }
  async findTransaction(
    transactionId: string,
  ): Promise<TransferTransactionDomain> {
    return this.fakeTransactionEntityManager.get(transactionId);
  }
  async saveTransaction(
    transaction: TransferTransactionDomain,
  ): Promise<TransferTransactionDomain> {
    this.fakeTransactionEntityManager.set(transaction.getId(), transaction);

    return this.fakeTransactionEntityManager.get(transaction.getId());
  }
}
export default FakeTransactionRepository;