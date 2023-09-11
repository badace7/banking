import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import Account from '../../../core/domain/account';
import { IAccountPort } from '../../../core/_ports/repositories/account.iport';
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
  async saveBankAccount(account: Account): Promise<void> {
    const entity = AccountMapper.toEntity(account);
    await this.manager.save(AccountEntity, entity);
  }
  async updateBankAccount(id: string, account: Account): Promise<boolean> {
    const entity = AccountMapper.toEntity(account);

    const isUpdated = await this.manager.update(AccountEntity, id, entity);

    return isUpdated.affected === 1 ? true : false;
  }

  async findAccountByUserId(userId: string): Promise<Account> {
    const account = await this.manager
      .createQueryBuilder(AccountEntity, 'account')
      .innerJoinAndSelect('account.user', 'user', 'user.id = :userId')
      .where('account.userId = :userId', { userId })
      .getOne();

    return account ? AccountMapper.toDomain(account) : null;
  }
}
