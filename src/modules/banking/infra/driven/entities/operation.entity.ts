import { Column, Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
import { AccountEntity } from './account.entity';
import { OperationTypeEntity } from './operation-type.entity';
import { FlowIndicatorEntity } from './flow-indicator.entity';

@Entity('operations')
export class OperationEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  label: string;
  @Column()
  amount: number;
  @Column()
  date: Date;
  @Column()
  accountId: string;
  @Column()
  operationTypeId: number;
  @Column()
  flowIndicatorId: number;

  @ManyToOne(() => AccountEntity, (account) => account.operations)
  account: AccountEntity;

  @ManyToOne(
    () => OperationTypeEntity,
    (operationType) => operationType.operations,
  )
  operationType: OperationTypeEntity;

  @ManyToOne(
    () => FlowIndicatorEntity,
    (flowIndicator) => flowIndicator.operations,
  )
  flowIndicator: FlowIndicatorEntity;
}
