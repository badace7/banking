import { OperationType } from 'src/modules/banking/domain/operation-type';
import { Operation } from '../../../domain/operation';
import { FlowIndicatorEntity } from '../entities/flow-indicator.entity';
import { OperationTypeEntity } from '../entities/operation-type.entity';
import { OperationEntity } from '../entities/operation.entity';
import { FlowIndicator } from 'src/modules/banking/domain/flow-indicator';

export class OperationMapper {
  static toEntity(operation: Operation): OperationEntity {
    const entity = new OperationEntity();
    const operationType = new OperationTypeEntity();
    operationType.id = operation.data.type.data.id;
    operationType.type = operation.data.type.data.type;

    const flowIndicator = new FlowIndicatorEntity();
    flowIndicator.id = operation.data.flow.data.id;
    flowIndicator.indicator = operation.data.flow.data.indicator;

    entity.id = operation.data.id;
    entity.label = operation.data.label;
    entity.amount = operation.data.amount;
    entity.accountId = operation.data.account;
    entity.operationType = operationType;
    entity.flowIndicator = flowIndicator;
    entity.date = operation.data.date;
    return entity;
  }

  static toDomain(operation: OperationEntity): Operation {
    const domain = Operation.create({
      id: operation.id,
      label: operation.label,
      amount: operation.amount,
      account: operation.accountId,
      type: new OperationType(
        operation.operationType.id,
        operation.operationType.type,
      ),
      flow: new FlowIndicator(
        operation.flowIndicator.id,
        operation.flowIndicator.indicator,
      ),
      date: operation.date,
    });

    return domain;
  }
}
