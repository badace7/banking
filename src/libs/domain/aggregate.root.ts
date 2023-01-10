import { IDomainEvent } from './domain.ievent';
import { Entity } from './entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private domainEvents: IDomainEvent<unknown>[] = [];

  getDomainEvents(): IDomainEvent<unknown>[] {
    return this.domainEvents;
  }

  protected addDomainEvent(event: IDomainEvent<unknown>): void {
    this.domainEvents.push(event);
    this.logEvent(event);
  }

  private logEvent(event: IDomainEvent<unknown>): void {
    console.info(
      `[Event Created]: ${this.constructor.name} make ${event.constructor.name}`,
    );
  }

  public clearEvent(): void {
    this.domainEvents.splice(0);
  }
}
