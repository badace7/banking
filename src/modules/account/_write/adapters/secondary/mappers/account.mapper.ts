import Account from '../../../core/domain/account';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  public static toDomain(account: AccountEntity): Account {
    return Account.create({
      id: account.id,
      number: account.number,
      balance: account.balance,
      user: account.userId,
      overdraftFacility: account.overdraftFacility,
    });
  }

  public static toEntity(account: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.number = account.data.number;
    accountEntity.balance = account.data.balance;
    accountEntity.userId = account.data.user;
    accountEntity.overdraftFacility = account.data.overdraftFacility;
    accountEntity.id = account.data.id;

    return accountEntity;
  }
}
