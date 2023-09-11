import { BalanceReadModel } from '../core/queries/balance.read-model';
import { GetBalanceQuery } from '../core/queries/get-balance.query';

export const GET_BALANCE_PORT = 'IGetBalance';

export interface IGetBalance {
  execute(query: GetBalanceQuery): Promise<BalanceReadModel>;
}
