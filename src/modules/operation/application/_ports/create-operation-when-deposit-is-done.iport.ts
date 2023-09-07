import { DepositEvent } from 'src/modules/banking/domain/event/deposit.event';

export const CREATE_OPERATION_PORT = 'ICreateOperationWhenDepositIsDone';

export interface ICreateOperationWhenDepositIsDone {
  execute(event: DepositEvent): Promise<void>;
}
