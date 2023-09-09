import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEvent } from 'src/libs/domain/aggregate.root';
import { IEventPublisher } from '../account/core/_ports/repositories/event-publisher.iport';

@Injectable()
export class EventPublisher implements IEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(domainEvents: IEvent[]) {
    await Promise.all(
      domainEvents.map(async (event) => {
        await this.eventEmitter.emitAsync(event.constructor.name, event);
        this.logEvent(event);
      }),
    );
  }

  private logEvent(event: IEvent): void {
    console.info(
      `[Event Created]: ${this.constructor.name} make ${event.constructor.name}`,
    );
  }
}
