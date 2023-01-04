import { Result } from 'src/core/exceptions/Result';
import TransferTransactionDomain from '../../entities/transaction.domain';

export interface ITransferRequest {
  execute(
    transferTransaction: TransferTransactionDomain,
  ): Promise<Result<void>>;
}
