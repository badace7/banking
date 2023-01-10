import { CreateTransferCommand } from '../commands/transfer.command';
export interface ITransferRequest {
  execute(transferTransaction: CreateTransferCommand): Promise<void>;
}
