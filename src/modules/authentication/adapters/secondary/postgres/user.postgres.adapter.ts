import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IUserPort } from '../../../core/_ports/repositories/user.iport';
import { User } from '../../../core/domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { RoleEntity } from '../entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class UserPostgresAdapter implements IUserPort {
  constructor(private readonly manager: EntityManager) {}
  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.manager.save(UserEntity, entity);
  }
  async findById(id: string): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, {
      where: { id },
      relations: ['role'],
    });
    return UserMapper.toDomain(entity);
  }
  async findByIdentifier(identifier: string): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, {
      where: { identifier: identifier },
      relations: ['role'],
    });
    return UserMapper.toDomain(entity);
  }

  async findAccountNumberByUserId(userId: string): Promise<string | null> {
    const result = await this.manager
      .createQueryBuilder(UserEntity, 'user')
      .innerJoinAndSelect('user.accounts', 'account')
      .select('account.number')
      .where('user.id = :userId', { userId })
      .getRawOne();

    return result.account_number || null;
  }

  async findRoleById(id: number) {
    const entity = await this.manager.findOne(RoleEntity, { where: { id } });
    return RoleMapper.toDomain(entity);
  }
}
