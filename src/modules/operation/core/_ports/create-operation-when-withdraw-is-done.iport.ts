import { WithdrawDoneEvent } from 'src/modules/account/core/domain/event/withdraw-done.event';

export const CREATE_WITHDRAW_OPERATION_PORT = 'ICreateWithdrawPort';

export interface ICreateOperationWhenWithdrawIsDone {
  execute(event: WithdrawDoneEvent): Promise<void>;
}
