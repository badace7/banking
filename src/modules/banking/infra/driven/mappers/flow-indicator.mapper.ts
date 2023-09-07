import { FlowIndicator } from 'src/modules/banking/domain/flow-indicator';
import { FlowIndicatorEntity } from '../entities/flow-indicator.entity';

export class FlowIndicatorMapper {
  static toDomain(entity: FlowIndicatorEntity): FlowIndicator {
    return new FlowIndicator(entity.id, entity.indicator);
  }
  static toEntity(flowIndicator: FlowIndicator): FlowIndicatorEntity {
    const entity = new FlowIndicatorEntity();
    entity.id = flowIndicator.data.id;
    entity.indicator = flowIndicator.data.indicator;
    return entity;
  }
}
