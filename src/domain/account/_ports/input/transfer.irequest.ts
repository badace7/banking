import { Result } from 'src/core/exceptions/result';
import TransferTransactionDomain from '../../entities/transaction.domain';

export interface ITransferRequest {
  execute(transferTransaction: TransferTransactionDomain): Promise<void>;
}
