import { v4 as createUUIDv4 } from 'uuid';
import { IEvent } from 'src/libs/domain/domain.ievent';

type debitEventProps = {
  origin: string;
  amount: number;
};

export class DebitEvent implements IEvent {
  public readonly id: string;
  public readonly type: string;
  public readonly payload: debitEventProps;
  public readonly dateEvent: Date;

  constructor(debitTransaction: debitEventProps) {
    this.id = createUUIDv4();
    this.type = 'DEBIT';
    this.payload = debitTransaction;
    this.dateEvent = new Date();
  }
  getId(): string {
    return this.id;
  }
}
