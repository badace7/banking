import { IEvent } from 'src/libs/domain/domain.ievent';

type transferEventProps = {
  label: string;
  amount: number;
  from: string;
  to: string;
};

export class TransferCreatedEvent implements IEvent {
  public id: string;
  public dateEvent: Date;
  public payload: transferEventProps;

  constructor(transferTransaction: transferEventProps, id: string) {
    this.id = id;
    this.dateEvent = new Date();
    this.payload = transferTransaction;
  }
  getId(): string {
    return this.id;
  }
}
