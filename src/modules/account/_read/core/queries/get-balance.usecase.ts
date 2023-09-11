import { IAccountPort } from 'src/modules/account/_write/core/_ports/repositories/account.iport';

import { IGetBalance } from '../../_ports/get-balance.iport';
import { BalanceReadModel } from './balance.read-model';
import { GetBalanceQuery } from './get-balance.query';
import { IDateProvider } from 'src/modules/account/_write/core/_ports/repositories/date-provider.iport';

export class GetBalance implements IGetBalance {
  constructor(
    private accountAdapter: IAccountPort,
    private dateAdapter: IDateProvider,
  ) {}
  async execute(query: GetBalanceQuery): Promise<BalanceReadModel> {
    const account = await this.accountAdapter.findBankAccount(
      query.accountNumber,
    );

    const date = this.dateAdapter.getNow();

    return BalanceReadModel.create({
      accountNumber: account.data.number,
      balance: account.data.balance,
      date: this.dateAdapter.toFormatedDate(date),
    });
  }
}
