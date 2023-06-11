import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { IEventPort } from '../_ports/transaction.iport';
import { WithdrawTransaction } from '../../domain/withdraw';
import { WithdrawCommand } from './withdraw.command';

export class Withdraw {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IEventPort')
    private eventStoreAdapter: IEventPort,
  ) {}
  async handle(command: WithdrawCommand): Promise<void> {
    const account = await this.accountAdapter.findBankAccount(command.from);

    const withdrawTransaction = WithdrawTransaction.create(command.amount);

    account.setTransactionToPerform(withdrawTransaction);

    account.withdrawMoney();

    this.accountAdapter.updateBankAccount(account.data.number, account);
  }
}
