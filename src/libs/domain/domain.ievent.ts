export interface IEvent {
  type: string;
  dateEvent: Date;
  getId(): string;
}
