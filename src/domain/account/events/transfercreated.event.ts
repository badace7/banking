import { IDomainEvent } from 'src/libs/domain/domain.ievent';
import TransferDomain from '../models/transfer.domain';

export class TransferCreatedEvent implements IDomainEvent<TransferDomain> {
  public dateEvent: Date;
  public payload: TransferDomain;

  constructor(transferTransaction: TransferDomain) {
    this.dateEvent = new Date();
    this.payload = transferTransaction;
  }

  getId(): string {
    return this.payload.getId();
  }

  getPayload(): TransferDomain {
    return this.payload;
  }
}
