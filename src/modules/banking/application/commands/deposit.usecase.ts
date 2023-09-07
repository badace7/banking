import {
  NotFoundException,
  UnprocessableException,
} from 'src/libs/exceptions/usecase.error';
import Account from '../../domain/account';
import { DepositCommand } from './deposit.command';
import {
  FlowIndicatorEnum,
  Operation,
  OperationTypeEnum,
} from '../../domain/operation';

import { IDateProvider } from '../_ports/repositories/date-provider.iport';
import { IAccountPort } from '../_ports/repositories/account.iport';
import { IOperationPort } from '../_ports/repositories/operation.iport';
import { ErrorMessage } from '../../domain/error/operation-message-error';
import { IEventPublisher } from '../_ports/event-publisher.iport';

export class Deposit {
  constructor(
    private accountAdapter: IAccountPort,
    private operationAdapter: IOperationPort,
    private dateAdapter: IDateProvider,
    private eventPublisher: IEventPublisher,
  ) {}
  async execute(command: DepositCommand): Promise<void> {
    if (command.amount < 10) {
      throw new UnprocessableException(ErrorMessage.CANNOT_DEPOSIT_UNDER_10);
    }
    const account = await this.getAccount(command.origin);

    account.deposit(command.amount);

    await this.saveAccountChanges(account);

    const operationType = await this.operationAdapter.getOperationTypeById(
      OperationTypeEnum.DEPOSIT,
    );
    const flowIndicator = await this.operationAdapter.getFlowIndicatorById(
      FlowIndicatorEnum.CREDIT,
    );

    const operation = Operation.create({
      id: `${command.id}-2`,
      label: 'Deposit',
      amount: command.amount,
      account: account.data.id,
      type: operationType,
      flow: flowIndicator,
      date: this.dateAdapter.getNow(),
    });

    await this.operationAdapter.save(operation);
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
    const isAccountUpdated = await this.accountAdapter.updateBankAccount(
      account.data.id,
      account,
    );

    if (!isAccountUpdated) {
      throw new Error(`Cannot update the account ${account.data.number}`);
    }
  }
}
