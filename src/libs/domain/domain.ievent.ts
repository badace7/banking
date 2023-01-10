export interface IDomainEvent<T> {
  dateEvent: Date;
  getId(): string;
  getPayload(): T;
}
