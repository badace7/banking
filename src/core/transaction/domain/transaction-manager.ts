import { TransactionRejectedError } from 'src/libs/exceptions/money-transfer-reject.error';
import Account from './account';
import { Money } from './value-objects/money';
import { DebitEvent } from '../application/events/debit.event';
import { CreditEvent } from '../application/events/credit.event';
import { Transaction } from './transaction';

export class TransactionManager {
  public _transaction: Transaction;

  debitBalance(account: Account) {
    if (
      this.isNotAuthorizedToPerformOperation(
        account,
        Money.create(this._transaction._amount),
      )
    ) {
      throw new TransactionRejectedError(
        `You cannot make this transaction because your balance is insufficient`,
      );
    }

    account.props.balance = account.props.balance.substract(
      Money.create(this._transaction._amount),
    );

    account.addDomainEvent(
      new DebitEvent({
        from: this._transaction._from,
        amount: this._transaction._amount,
        label: this._transaction._label,
      }),
    );
  }

  creditBalance(account: Account) {
    account.props.balance = account.props.balance.add(
      Money.create(this._transaction._amount),
    );

    account.addDomainEvent(
      new CreditEvent({
        from: this._transaction._from,
        amount: this._transaction._amount,
        label: this._transaction._label,
      }),
    );
  }

  private isNotAuthorizedToPerformOperation(
    account: Account,
    amount: Money,
  ): boolean {
    return (
      this.isNotAuthorizedWithoutOverdraft(account, amount) ||
      this.isNotAuthorizedWithOverdraft(account, amount)
    );
  }

  private isNotAuthorizedWithoutOverdraft(
    account: Account,
    amount: Money,
  ): boolean {
    return (
      amount.isGreaterThan(account.props.balance) &&
      account.props.overdraftFacility === null
    );
  }

  private isNotAuthorizedWithOverdraft(
    account: Account,
    amount: Money,
  ): boolean {
    return account.props.overdraftFacility.isOperationAuthorized(
      account.props.balance,
      amount,
    );
  }
}
