import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './account.entity';
import { IAccountPort } from 'src/core/transaction/application/_ports/account.iport';
import Account from 'src/core/transaction/domain/account';

@Injectable()
export class AccountPostgresAdapter implements IAccountPort {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}
  async findBankAccount(accountNumber: string): Promise<Account> {
    const account = await this.repository.findOne({
      where: {
        number: accountNumber,
      },
    });

    return this.toDomain(account);
  }
  saveBankAccount(account: Account): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async updateBankAccount(
    accountNumber: string,
    accountDomain: Account,
  ): Promise<Account> {
    const accountAlreadySave = await this.repository.findOne({
      where: {
        number: accountNumber,
      },
    });

    const accountToRegister = this.toEntity(accountDomain);

    const accountUpdated = await this.repository.save({
      ...accountAlreadySave,
      ...accountToRegister,
    });

    return this.toDomain(accountUpdated);
  }

  private toDomain(account: AccountEntity): Account {
    return Account.create(
      {
        number: account.number,
        balance: account.balance,
        customer: account.customer,
        overdraftFacility: account.overdraftFacility,
      },
      account.id,
    );
  }

  private toEntity(accountDomain: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.number = accountDomain.data.number;
    accountEntity.balance = accountDomain.data.balance;
    accountEntity.customer = accountDomain.data.customer;
    accountEntity.overdraftFacility = accountDomain.data.overdraftFacility;
    accountEntity.id = accountDomain.getId();

    return accountEntity;
  }
}