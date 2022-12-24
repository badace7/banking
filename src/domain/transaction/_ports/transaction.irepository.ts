import TransferTransactionDomain from '../domain/transaction.domain';

export interface ITransactionRepository {
  findTransaction(transactionId: string): Promise<TransferTransactionDomain>;
  saveTransaction(transaction: TransferTransactionDomain): Promise<void>;
}
