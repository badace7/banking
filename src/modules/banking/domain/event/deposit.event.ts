import { IEvent } from 'src/libs/domain/aggregate.root';

export class DepositEvent implements IEvent {
  constructor(public readonly id: any, public readonly payload: any) {}
}
