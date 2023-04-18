import { CreateTransferCommand } from '../../commands/transfer.command';
export interface ITransferRequest {
  execute(command: CreateTransferCommand): Promise<void>;
}
