export interface IEvent {
  type: string;
  dateEvent: Date;
  payload: any;
  getId(): string;
}
