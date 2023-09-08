import { DepositDoneEvent } from 'src/modules/account/domain/event/deposit-done.event';

export const CREATE_DEPOSIT_OPERATION_PORT =
  'ICreateOperationWhenDepositIsDone';

export interface ICreateOperationWhenDepositIsDone {
  execute(event: DepositDoneEvent): Promise<void>;
}
