import { v4 as createUUIDv4 } from 'uuid';
import { IEvent } from 'src/libs/domain/domain.ievent';

type creditEventProps = {
  from: string;
  amount: number;
  label: string;
};

export class CreditEvent implements IEvent {
  public readonly id: string;
  public readonly type: string;
  public readonly payload: creditEventProps;
  public readonly dateEvent: Date;

  constructor(creditTransaction: creditEventProps) {
    this.id = createUUIDv4();
    this.type = 'CREDIT';
    this.payload = creditTransaction;
    this.dateEvent = new Date();
  }
  getId(): string {
    return this.id;
  }
}
