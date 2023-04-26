import { EventStoreDBClient, FORWARDS, jsonEvent } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';
import { IEventPort } from 'src/core/account/application/_ports/transaction.iport';
import {
  CreditEvent,
  creditEventProps,
} from 'src/core/account/application/events/credit.event';
import {
  DebitEvent,
  debitEventProps,
} from 'src/core/account/application/events/debit.event';
import { IEvent } from 'src/libs/domain/domain.ievent';

@Injectable()
export class EventStoreDBAdapter implements IEventPort {
  constructor(private readonly client: EventStoreDBClient) {}

  async save(transactionEvents: IEvent[], accountId: string) {
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

  async getAll(streamName: string): Promise<IEvent[]> {
    const stream = await this.client.readStream(streamName, {
      direction: FORWARDS,
    });
    const events: IEvent[] = [];
    for await (const payload of stream) {
      const { event } = payload;
      if (event.type === 'CREDIT') {
        const creditEvent = new CreditEvent(
          event.data.valueOf() as creditEventProps,
          event.id,
        );
        events.push(creditEvent);
      }
      if (event.type === 'DEBIT') {
        const debitEvent = new DebitEvent(
          event.data.valueOf() as debitEventProps,
          event.id,
        );
        events.push(debitEvent);
      }
    }

    return events;
  }
}
