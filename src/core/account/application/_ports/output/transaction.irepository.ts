import TransferDomain from '../../../domain/transfer.domain';

export interface ITransactionRepository {
  findTransaction(transactionId: string): Promise<TransferDomain>;
  saveTransaction(transaction: TransferDomain): Promise<TransferDomain>;
  getAll(): Promise<TransferDomain[]>;
}
