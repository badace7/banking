import { IGetBalance } from '../../_ports/get-balance.iport';
import { BalanceReadModel } from './balance.read-model';
import { GetBalanceQuery } from './get-balance.query';
import { EntityManager } from 'typeorm';

export class GetBalance implements IGetBalance {
  constructor(private readonly manager: EntityManager) {}
  async execute(query: GetBalanceQuery): Promise<BalanceReadModel> {
    const sqlQuery = 'SELECT number, balance FROM accounts WHERE number = $1';

    const params = [query.accountNumber];

    const [result] = await this.manager.query(sqlQuery, params);

    return BalanceReadModel.create(result);
  }
}
