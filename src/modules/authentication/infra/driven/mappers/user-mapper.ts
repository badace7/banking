import { User } from 'src/modules/authentication/domain/user';
import { UserEntity } from '../entities/user.entity';
import { Role } from 'src/modules/authentication/domain/role';
import { RoleEntity } from '../entities/role.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.identifier,
      entity.password,
      entity.firstName,
      entity.lastName,
      new Role(entity.role.id, entity.role.role),
    );
  }
  static toEntity(user: User): UserEntity {
    const role = new RoleEntity();
    role.id = user.data.role.data.id;
    role.role = user.data.role.data.role;

    const entity = new UserEntity();
    entity.id = user.data.id;
    entity.identifier = user.data.identifier;
    entity.password = user.data.password;
    entity.firstName = user.data.firstName;
    entity.lastName = user.data.lastName;
    entity.role = role;
    return entity;
  }
}
