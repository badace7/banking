import TransferTransactionDomain from '../../entities/transaction.domain';

export interface ITransferRequest {
  execute(transferTransaction: TransferTransactionDomain): Promise<void>;
}
