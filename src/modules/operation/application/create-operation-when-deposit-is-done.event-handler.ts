import { OnEvent } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { DepositEvent } from '../../banking/domain/event/deposit.event';

import { IOperationPort } from './_ports/operation.iport';
import {
  FlowIndicatorEnum,
  Operation,
  OperationTypeEnum,
} from '../domain/operation';
import { ICreateOperationWhenDepositIsDone } from './_ports/create-operation-when-deposit-is-done.iport';
import { IDateProvider } from './_ports/date-provider.iport';

export class CreateOperationWhenDepositIsDone
  implements ICreateOperationWhenDepositIsDone
{
  constructor(
    private readonly operationAdapter: IOperationPort,
    private readonly dateProvider: IDateProvider,
  ) {}

  @OnEvent(DepositEvent.name, { async: true, promisify: true })
  async execute(event: DepositEvent): Promise<void> {
    const operationType = await this.operationAdapter.getOperationTypeById(
      OperationTypeEnum.DEPOSIT,
    );
    const flowIndicator = await this.operationAdapter.getFlowIndicatorById(
      FlowIndicatorEnum.CREDIT,
    );

    const operation = Operation.create({
      id: uuidv4(),
      label: 'Deposit',
      amount: event.payload.amount,
      account: event.payload.account,
      type: operationType,
      flow: flowIndicator,
      date: this.dateProvider.getNow(),
    });

    await this.operationAdapter.save(operation);
  }
}
