import { OnEvent } from '@nestjs/event-emitter';
import { DepositEvent } from '../banking/domain/event/deposit.event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateOperationWhenDepositIsDone {
  @OnEvent(DepositEvent.name, { async: true, promisify: true })
  async execute(event: DepositEvent): Promise<void> {
    console.log('operation done : ', event);
  }
}
