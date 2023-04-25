import { IEvent } from 'src/libs/domain/domain.ievent';
import TransferDomain from '../../../domain/transfer.domain';

export interface ITransactionRepository {
  findTransactionEvent(transactionId: string): Promise<TransferDomain>;
  saveTransactionEvent(
    transactionEvents: IEvent[],
    accountId: string,
  ): Promise<void>;
  getAll(): Promise<TransferDomain[]>;
}
