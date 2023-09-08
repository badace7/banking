import { IEvent } from 'src/libs/domain/aggregate.root';

export const EVENT_PUBLISHER_PORT = 'IEventPublisher';

export interface IEventPublisher {
  publish(domainEvents: IEvent[]): Promise<void>;
}
