import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { TransferEvent } from '../events/transfer.event';
import { Entity } from 'src/libs/domain/Entity';

export type TransferProperties = {
  label: string;
  amount: number;
  from: string;
  to: string;
  date: Date;
};

class TransferDomain extends Entity<TransferProperties> {
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
    return new TransferDomain(transaction);
  }
}

export default TransferDomain;
