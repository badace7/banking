import Account from '../../../domain/account';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  public static toDomain(account: AccountEntity): Account {
    return Account.create({
      id: account.id,
      number: account.number,
      balance: account.balance,
      user: account.user,
      overdraftFacility: account.overdraftFacility,
    });
  }

  public static toEntity(account: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.number = account.data.number;
    accountEntity.balance = account.data.balance;
    accountEntity.user = account.data.user;
    accountEntity.overdraftFacility = account.data.overdraftFacility;
    accountEntity.id = account.data.id;

    return accountEntity;
  }
}
