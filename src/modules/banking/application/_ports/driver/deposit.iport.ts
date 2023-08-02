import { DepositCommand } from '../../commands/deposit.command';

export const DEPOSIT_PORT = 'IDeposit';

export interface IDeposit {
  execute(command: DepositCommand): Promise<void>;
}
