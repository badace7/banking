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
  }

  public clearEvents(): void {
    this.domainEvents.splice(0);
  }
}
