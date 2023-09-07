import { Operation } from '../domain/operation';
import { FlowIndicatorMapper } from './flow-indicator.mapper';

import { OperationTypeMapper } from './operation-type.mapper';
import { OperationEntity } from './operation.entity';

export class OperationMapper {
  static toEntity(operation: Operation): OperationEntity {
    const entity = new OperationEntity();
    entity.id = operation.data.id;
    entity.label = operation.data.label;
    entity.amount = operation.data.amount;
    entity.accountId = operation.data.account;
    entity.operationType = OperationTypeMapper.toEntity(operation.data.type);
    entity.flowIndicator = FlowIndicatorMapper.toEntity(operation.data.flow);
    entity.date = operation.data.date;
    return entity;
  }

  static toDomain(operation: OperationEntity): Operation {
    const domain = Operation.create({
      id: operation.id,
      label: operation.label,
      amount: operation.amount,
      account: operation.accountId,
      type: OperationTypeMapper.toDomain(operation.operationType),
      flow: FlowIndicatorMapper.toDomain(operation.flowIndicator),
      date: operation.date,
    });

    return domain;
  }
}
