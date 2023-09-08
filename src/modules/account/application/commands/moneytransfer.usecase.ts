import { NotFoundException } from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import { MoneyTransferCommand } from './transfer.command';
import { IMoneyTransfer } from '../_ports/usecases/money-transfer.iport';
import { IAccountPort } from '../_ports/repositories/account.iport';
import { ErrorMessage } from '../../domain/error/operation-message-error';
import { IEventPublisher } from '../_ports/event-publisher.iport';

export class MoneyTransfer implements IMoneyTransfer {
  constructor(
    private accountAdapter: IAccountPort,
    private eventPublisher: IEventPublisher,
  ) {}

  async execute(command: MoneyTransferCommand): Promise<void> {
    const originAccount = await this.getAccount(command.origin);
    const destinationAccount = await this.getAccount(command.destination);

    originAccount.transferTo(destinationAccount, {
      label: command.label,
      amount: command.amount,
    });

    await Promise.all([
      this.updateAccount(originAccount),
      this.updateAccount(destinationAccount),
    ]);
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

  private async updateAccount(account: Account) {
    await this.eventPublisher.publish(account.getDomainEvents());
    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );

    account.clearEvents();

    if (!isAccountUpdated) {
      throw new Error(`Cannot update the account ${account.data.number}`);
    }
  }
}
