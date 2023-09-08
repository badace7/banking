import { IEvent } from 'src/libs/domain/aggregate.root';
import { IEventPublisher } from 'src/modules/account/application/_ports/event-publisher.iport';

export class FakeEventPublisher implements IEventPublisher {
  private events: Map<string, IEvent> = new Map();
  publish(domainEvents: IEvent[]): Promise<void> {
    domainEvents.forEach((event) => {
      this.events.set(event.id, event);
    });

    return Promise.resolve();
  }

  getEvents(): IEvent[] {
    return [...this.events.values()];
  }
}
