import { User } from 'src/modules/authentication/domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.identifier,
      entity.password,
      entity.firstName,
      entity.lastName,
      entity.roleId,
    );
  }
  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.data.id;
    entity.identifier = user.data.identifier;
    entity.password = user.data.password;
    entity.firstName = user.data.firstName;
    entity.lastName = user.data.lastName;
    entity.roleId = user.data.role;
    return entity;
  }
}
