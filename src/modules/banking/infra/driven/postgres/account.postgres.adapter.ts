import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import Account from '../../../domain/account';
import { IAccountPort } from '../../../application/_ports/repositories/account.iport';
import { AccountMapper } from '../mappers/account.mapper';

@Injectable()
export class AccountPostgresAdapter implements IAccountPort {
  constructor(private readonly manager: EntityManager) {}
  async findBankAccount(accountNumber: string): Promise<Account> {
    const account = await this.manager.findOne(AccountEntity, {
      where: {
        number: accountNumber,
      },
    });

    return AccountMapper.toDomain(account);
  }
  saveBankAccount(account: Account): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async updateBankAccount(id: string, account: Account): Promise<boolean> {
    const entity = AccountMapper.toEntity(account);

    const isUpdated = await this.manager.update(AccountEntity, id, entity);

    return isUpdated.affected === 1 ? true : false;
  }
}
