import { MoneyTransferCommand } from '../../commands/transfer.command';

export const MONEY_TRANSFER_PORT = 'IMoneyTransfer';

export interface IMoneyTransfer {
  execute(command: MoneyTransferCommand): Promise<void>;
}
