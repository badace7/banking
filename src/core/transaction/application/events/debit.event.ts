import { v4 as createUUIDv4 } from 'uuid';
import { IEvent } from 'src/libs/domain/domain.ievent';

export type debitEventProps = {
  from: string;
  amount: number;
  label: string;
};

export class DebitEvent implements IEvent {
  public readonly id: string;
  public readonly type: string;
  public readonly payload: debitEventProps;
  public readonly dateEvent: Date;

  constructor(debitTransaction: debitEventProps, id?: string) {
    this.id = id ?? createUUIDv4();
    this.type = 'DEBIT';
    this.payload = debitTransaction;
    this.dateEvent = new Date();
  }
  getId(): string {
    return this.id;
  }
}
