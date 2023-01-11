import { IEvent } from 'src/libs/domain/domain.ievent';

type transferEventProps = {
  label: string;
  amount: number;
  from: string;
  to: string;
};

export class TransferEvent implements IEvent {
  public readonly id: string;
  public readonly type: string;
  public readonly payload: transferEventProps;
  public readonly dateEvent: Date;

  constructor(transferTransaction: transferEventProps, id: string) {
    this.id = id;
    this.type = 'CREATE';
    this.payload = transferTransaction;
    this.dateEvent = new Date();
  }
  getId(): string {
    return this.id;
  }
}
