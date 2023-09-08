import { IOperationPort } from './_ports/operation.iport';
import { IDateProvider } from './_ports/date-provider.iport';
import { OnEvent } from '@nestjs/event-emitter';
import {
  FlowIndicatorEnum,
  Operation,
  OperationTypeEnum,
} from '../domain/operation';
import { v4 as uuidv4 } from 'uuid';
import { ICreateOperationWhenWithdrawIsDone } from './_ports/create-operation-when-withdraw-is-done.iport';
import { WithdrawDoneEvent } from 'src/modules/account/domain/event/withdraw-done.event';

export class CreateOperationWhenWithdrawIsDone
  implements ICreateOperationWhenWithdrawIsDone
{
  constructor(
    private readonly operationAdapter: IOperationPort,
    private readonly dateProvider: IDateProvider,
  ) {}

  @OnEvent(WithdrawDoneEvent.name, { async: true, promisify: true })
  async execute(event: WithdrawDoneEvent): Promise<void> {
    const operationType = await this.operationAdapter.getOperationTypeById(
      OperationTypeEnum.WITHDRAW,
    );
    const flowIndicator = await this.operationAdapter.getFlowIndicatorById(
      FlowIndicatorEnum.DEBIT,
    );

    const operation = Operation.create({
      id: uuidv4(),
      label: 'Withdraw',
      amount: event.payload.amount,
      account: event.payload.account,
      type: operationType,
      flow: flowIndicator,
      date: this.dateProvider.getNow(),
    });

    await this.operationAdapter.save(operation);
  }
}
