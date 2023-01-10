import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { TransferCreated } from '../events/transfer.created';

type TransferProperties = {
  label: string;
  amount: number;
  from: string;
  to: string;
  date: Date;
};

class TransferDomain extends AggregateRoot<TransferProperties> {
  private constructor(properties: TransferProperties, id?: string) {
    super(properties, id);
  }

  public getAmount(): number {
    return this.properties.amount;
  }

  public getLabel(): string {
    return this.properties.label;
  }

  public getDate(): Date {
    return this.properties.date;
  }

  public getFrom(): string {
    return this.properties.from;
  }

  public getTo(): string {
    return this.properties.to;
  }

  static create(transaction: TransferProperties): TransferDomain {
    const transfer = new TransferDomain(transaction);
    const transferEvent = new TransferCreated(transfer);
    transfer.addDomainEvent(transferEvent);
    return transfer;
  }
}

export default TransferDomain;
