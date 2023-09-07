export interface IEventPublisher {
  publish<T>(domainEvents: T[]): Promise<void>;
}
