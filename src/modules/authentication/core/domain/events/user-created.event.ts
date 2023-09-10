import { IEvent } from 'src/libs/domain/aggregate.root';

export class UserCreatedEvent implements IEvent {
  constructor(public readonly id: any, public readonly payload: any) {}
}
