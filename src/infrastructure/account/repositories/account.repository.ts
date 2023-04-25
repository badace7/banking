import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { IAccountRepository } from 'src/core/account/application/_ports/output/account.irepository';
import AccountDomain from 'src/core/account/domain/account.domain';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly manager: Repository<AccountEntity>,
  ) {}
  async findBankAccount(accountNumber: string): Promise<AccountDomain> {
    const account = await this.manager.findOne({
      where: {
        number: accountNumber,
      },
    });

    return this.toDomain(account);
  }
  saveBankAccount(account: AccountDomain): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async updateBankAccount(
    accountNumber: string,
    accountDomain: AccountDomain,
  ): Promise<AccountDomain> {
    const accountAlreadySave = await this.manager.findOne({
      where: {
        number: accountNumber,
      },
    });

    const accountToRegister = this.toEntity(accountDomain);

    const accountUpdated = await this.manager.save({
      ...accountAlreadySave,
      ...accountToRegister,
    });

    return this.toDomain(accountUpdated);
  }

  private toDomain(account: AccountEntity): AccountDomain {
    return AccountDomain.create(
      {
        number: account.number,
        balance: account.balance,
        customer: account.customer,
        overdraftFacility: account.overdraftFacility,
      },
      account.id,
    );
  }

  private toEntity(accountDomain: AccountDomain): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.number = accountDomain.getNumber();
    accountEntity.balance = accountDomain.getBalance();
    accountEntity.customer = accountDomain.getCustomer();
    accountEntity.overdraftFacility = accountDomain.getOverdraftFacility();
    accountEntity.id = accountDomain.getId();

    return accountEntity;
  }
}
