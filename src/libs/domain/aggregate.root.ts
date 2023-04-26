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

  protected addDomainEvent(event: IEvent): void {
    this.domainEvents.push(event);
    this.logEvent(event);
  }

  private logEvent(event: IEvent): void {
    console.info(
      `[Event Created]: ${this.constructor.name} make ${event.constructor.name}`,
    );
  }

  public clearEvent(): void {
    this.domainEvents.splice(0);
  }
}
