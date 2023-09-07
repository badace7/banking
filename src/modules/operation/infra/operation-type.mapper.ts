import { OperationType } from '../domain/operation-type';
import { OperationTypeEntity } from './operation-type.entity';

export class OperationTypeMapper {
  static toDomain(entity: OperationTypeEntity): OperationType {
    return new OperationType(entity.id, entity.type);
  }
  static toEntity(operationType: OperationType): OperationTypeEntity {
    const entity = new OperationTypeEntity();
    entity.id = operationType.data.id;
    entity.type = operationType.data.type;
    return entity;
  }
}
