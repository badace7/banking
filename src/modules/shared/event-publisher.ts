import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { IEvent } from 'src/libs/domain/aggregate.root';
import { IEventPublisher } from '../account/application/_ports/event-publisher.iport';

@Injectable()
export class EventPublisher implements IEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(domainEvents: IEvent[]) {
    await Promise.all(
      domainEvents.map(async (event) => {
        return await this.eventEmitter.emitAsync(event.constructor.name, event);
      }),
    );
  }
}
