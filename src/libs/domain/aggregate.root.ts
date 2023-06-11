import { IEvent } from './domain.ievent';
import { Entity } from './Entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private domainEvents: IEvent[] = [];

  public getDomainEvents(): IEvent[] {
    return this.domainEvents;
  }

  public setDomainEvents(events: IEvent[]) {
    this.domainEvents = events;
  }

  public addDomainEvent(event: IEvent): void {
    this.domainEvents.push(event);
  }

  public clearEvent(): void {
    this.domainEvents.splice(0);
  }
}
