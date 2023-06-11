import { TransactionRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';
import Account from './account';
import { DebitEvent } from '../application/events/debit.event';
import { CreditEvent } from '../application/events/credit.event';
import { Transaction } from './transaction';

export class TransactionManager {
  public transaction: Transaction;

  debitBalance(account: Account) {
    if (
      this.isNotAuthorizedToPerformOperation(account, this.transaction.amount)
    ) {
      throw new TransactionRejectedError(
        `You cannot make this transaction because your balance is insufficient`,
      );
    }

    account.props.balance = account.props.balance.substract(
      this.transaction.amount,
    );

    account.addDomainEvent(
      new DebitEvent({
        from: this.transaction.from,
        amount: this.transaction.amount,
        label: this.transaction.label,
      }),
    );
  }

  creditBalance(account: Account) {
    account.props.balance = account.props.balance.add(this.transaction.amount);
    account.addDomainEvent(
      new CreditEvent({
        from: this.transaction.from,
        amount: this.transaction.amount,
        label: this.transaction.label,
      }),
    );
  }

  private isNotAuthorizedToPerformOperation(
    account: Account,
    amount: number,
  ): boolean {
    return (
      this.isNotAuthorizedWithoutOverdraft(account, amount) ||
      this.isNotAuthorizedWithOverdraft(account, amount)
    );
  }

  private isNotAuthorizedWithoutOverdraft(
    account: Account,
    amount: number,
  ): boolean {
    return (
      account.props.balance.isLessThan(amount) &&
      account.props.overdraftFacility === null
    );
  }

  private isNotAuthorizedWithOverdraft(
    account: Account,
    amount: number,
  ): boolean {
    return account.props.overdraftFacility.isOperationAuthorized(
      account.props.balance,
      amount,
    );
  }
}
