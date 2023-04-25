import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'src/core/account/application/_ports/output/transaction.irepository';
import TransferDomain from 'src/core/account/domain/transfer.domain';
import { IEvent } from 'src/libs/domain/domain.ievent';

@Injectable()
export class TransferRepository implements ITransactionRepository {
  constructor(private readonly client: EventStoreDBClient) {}
  async saveTransactionEvent(transactionEvents: IEvent[], accountId: string) {
    const events = transactionEvents.map((event) =>
      jsonEvent({
        id: event.getId(),
        type: event.type,
        data: event.payload,
        date: event.dateEvent,
      }),
    );

    await this.client.appendToStream(accountId.toString(), events);
  }
  findTransactionEvent(transactionId: string): Promise<TransferDomain> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<TransferDomain[]> {
    throw new Error('Method not implemented.');
  }
}

