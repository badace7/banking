import { IAccountPort } from '../_ports/repositories/account.iport';
import { IDateProvider } from '../_ports/repositories/date-provider.iport';
import { IGetBalance } from '../_ports/usecases/get-balance.iport';
import { BalanceReadModel } from './balance.read-model';
import { GetBalanceQuery } from './get-balance.query';

export class GetBalance implements IGetBalance {
  constructor(
    private accountAdapter: IAccountPort,
    private dateProvider: IDateProvider,
  ) {}
  async execute(query: GetBalanceQuery): Promise<BalanceReadModel> {
    const account = await this.accountAdapter.findBankAccount(
      query.accountNumber,
    );

    const date = this.dateProvider.getNow();

    return BalanceReadModel.create({
      accountNumber: account.data.number,
      balance: account.data.balance,
      date: this.dateProvider.toReadableDate(date),
    });
  }
}
