import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OperationEntity } from './operation.entity';

@Entity('flow_indicators')
export class FlowIndicatorEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  indicator: string;

  @OneToMany(() => OperationEntity, (operation) => operation.flowIndicator)
  operations: OperationEntity[];
}
