import { Role } from 'src/modules/authentication/core/domain/role';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(entity: RoleEntity): Role {
    return new Role(entity.id, entity.role);
  }
  static toEntity(role: Role): RoleEntity {
    const entity = new RoleEntity();
    entity.id = role.data.id;
    entity.role = role.data.role;
    return entity;
  }
}
