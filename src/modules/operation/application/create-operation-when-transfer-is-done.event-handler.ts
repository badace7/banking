import { IOperationPort } from './_ports/operation.iport';
import { IDateProvider } from './_ports/date-provider.iport';
import { OnEvent } from '@nestjs/event-emitter';
import {
  FlowIndicatorEnum,
  Operation,
  OperationTypeEnum,
} from '../domain/operation';
import { ICreateOperationWhenTransferIsDone } from './_ports/create-operation-when-transfer-is-done';
import { TransferDoneEvent } from 'src/modules/account/domain/event/transfer-done.event';

import { v4 as uuidv4 } from 'uuid';

export class CreateOperationWhenTransferIsDone
  implements ICreateOperationWhenTransferIsDone
{
  constructor(
    private readonly operationAdapter: IOperationPort,
    private readonly dateProvider: IDateProvider,
  ) {}

  @OnEvent(TransferDoneEvent.name, { async: true, promisify: true })
  async execute(event: TransferDoneEvent): Promise<void> {
    const operationTypeSource =
      await this.operationAdapter.getOperationTypeById(
        OperationTypeEnum.TRANSFER,
      );
    const flowIndicatorSource =
      await this.operationAdapter.getFlowIndicatorById(FlowIndicatorEnum.DEBIT);

    const operationTypeDestination =
      await this.operationAdapter.getOperationTypeById(
        OperationTypeEnum.TRANSFER,
      );
    const flowIndicatorDestination =
      await this.operationAdapter.getFlowIndicatorById(
        FlowIndicatorEnum.CREDIT,
      );

    const sourceOperation = Operation.create({
      id: uuidv4(),
      label: event.payload.label,
      amount: event.payload.amount,
      account: event.payload.originAccount,
      type: operationTypeSource,
      flow: flowIndicatorSource,
      date: this.dateProvider.getNow(),
    });

    const destinationOperation = Operation.create({
      id: uuidv4(),
      label: event.payload.label,
      amount: event.payload.amount,
      account: event.payload.destinationAccount,
      type: operationTypeDestination,
      flow: flowIndicatorDestination,
      date: this.dateProvider.getNow(),
    });

    await Promise.all([
      this.operationAdapter.save(sourceOperation),
      this.operationAdapter.save(destinationOperation),
    ]);
  }
}
