import { Operation } from '../../../domain/operation';
import { OperationEntity } from '../entities/operation.entity';

export class OperationMapper {
  static toEntity(operation: Operation): OperationEntity {
    const entity = new OperationEntity();
    entity.id = operation.data.id;
    entity.label = operation.data.label;
    entity.amount = operation.data.amount;
    entity.accountId = operation.data.account;
    entity.operationTypeId = operation.data.type;
    entity.flowIndicatorId = operation.data.flow;
    entity.date = operation.data.date;
    return entity;
  }

  static toDomain(operation: OperationEntity): Operation {
    const domain = Operation.create({
      id: operation.id,
      label: operation.label,
      amount: operation.amount,
      account: operation.accountId,
      type: operation.operationTypeId,
      flow: operation.flowIndicatorId,
      date: operation.date,
    });

    return domain;
  }
}
