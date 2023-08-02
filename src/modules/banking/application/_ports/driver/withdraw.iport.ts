import { WithdrawCommand } from '../../commands/withdraw.command';

export const WITHDRAW_PORT = 'IWithdraw';

export interface IWithdraw {
  execute(command: WithdrawCommand): Promise<void>;
}
