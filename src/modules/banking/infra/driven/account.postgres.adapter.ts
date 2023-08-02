import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './account.entity';
import Account from '../../domain/account';
import { IAccountPort } from '../../application/_ports/account.iport';

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
  ): Promise<any> {
    const accountUpdated = await this.repository.save(accountDomain.data);

    return this.toDomain(accountUpdated);
  }

  private toDomain(account: AccountEntity): Account {
    return Account.create({
      id: account.id,
      number: account.number,
      balance: account.balance,
      customer: account.customer,
      overdraftFacility: account.overdraftFacility,
    });
  }

  private toEntity(account: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.number = account.data.number;
    accountEntity.balance = account.data.balance;
    accountEntity.customer = account.data.customer;
    accountEntity.overdraftFacility = account.data.overdraftFacility;
    accountEntity.id = account.data.id;

    return accountEntity;
  }
}