import { TransferDoneEvent } from 'src/modules/account/core/domain/event/transfer-done.event';

export const CREATE_TRANSFER_OPERATION_PORT =
  'ICreateOperationWhenTransferIsDone';

export interface ICreateOperationWhenTransferIsDone {
  execute(event: TransferDoneEvent): Promise<void>;
}
