import { Inject } from '@nestjs/common';
import { IAccountPort } from '../_ports/account.iport';
import { IEventPort } from '../_ports/transaction.iport';
import { WithdrawTransaction } from '../../domain/withdraw';
import { WithdrawCommand } from './withdraw.command';
import { UsecaseError } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';

export class Withdraw {
  constructor(
    @Inject('IAccountPort') private accountAdapter: IAccountPort,
    @Inject('IEventPort')
    private eventStoreAdapter: IEventPort,
  ) {}
  async handle(command: WithdrawCommand): Promise<void> {
    const account = await this.getAccount(command.from);

    const withdrawTransaction = WithdrawTransaction.create(command.amount);

    account.setTransactionToPerform(withdrawTransaction);

    account.withdrawMoney();

    this.saveAccountChanges(account);
  }

  private async getAccount(accountNumber: string): Promise<Account> {
    const account = await this.accountAdapter.findBankAccount(accountNumber);

    if (!account) {
      throw new UsecaseError(`The account ${accountNumber} not found.`);
    }
    return account;
  }

  private async saveAccountChanges(account: Account) {
    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.number,
      account,
    );

    if (!isAccountUpdated) {
      throw new UsecaseError(
        `Cannot update the account ${account.data.number}`,
      );
    }

    await this.eventStoreAdapter.save(
      account.getDomainEvents(),
      account.getId(),
    );
  }
}
