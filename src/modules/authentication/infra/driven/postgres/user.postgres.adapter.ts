import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IUserPort } from '../../../application/_ports/user.iport';
import { User } from '../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user-mapper';

@Injectable()
export class UserPostgresAdapter implements IUserPort {
  constructor(private readonly manager: EntityManager) {}
  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.manager.save(UserEntity, entity);
  }
  async findById(id: string): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, { where: { id } });
    return UserMapper.toDomain(entity);
  }
  async findByIdentifier(identifier: string): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, {
      where: { identifier: identifier },
    });
    return UserMapper.toDomain(entity);
  }
}
