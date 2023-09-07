export interface IEvent {
  id: any;
  payload: any;
}

export abstract class AggregateRoot {
  private domainEvents: IEvent[] = [];

  getDomainEvents(): IEvent[] {
    return this.domainEvents;
  }

  getLastDomainEvent(): IEvent {
    return this.domainEvents[this.domainEvents.length - 1];
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

  public clearEvents(): void {
    this.domainEvents.splice(0);
  }
}
