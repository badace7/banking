import { NotFoundException } from 'src/libs/exceptions/usecase.error';
import Account from '../domain/account';
import { ErrorMessage } from '../domain/error/operation-message-error';
import { IEventPublisher } from '../_ports/repositories/event-publisher.iport';
import { IAccountPort } from '../_ports/repositories/account.iport';
import { WithdrawCommand } from './withdraw.command';

export class Withdraw {
  constructor(
    private accountAdapter: IAccountPort,
    private eventPublisher: IEventPublisher,
  ) {}
  async execute(command: WithdrawCommand): Promise<void> {
    const account = await this.getAccount(command.origin);

    account.withdraw(command.amount);

    await this.saveAccountChanges(account);
  }

  private async getAccount(accountNumber: string): Promise<Account> {
    const account = await this.accountAdapter.findBankAccount(accountNumber);

    if (!account) {
      throw new NotFoundException(
        `${ErrorMessage.ACCOUNT_IS_NOT_FOUND} n° ${accountNumber}`,
      );
    }
    return account;
  }

  private async saveAccountChanges(account: Account) {
    await this.eventPublisher.publish(account.getDomainEvents());
    account.clearEvents();

    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );

    if (!isAccountUpdated) {
      throw new Error(`Cannot update the account ${account.data.number}`);
    }
  }
}
