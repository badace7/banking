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

  @ManyToOne(() => AccountEntity, (account) => account.operations)
  account: AccountEntity;

  @RelationId((operation: OperationEntity) => operation.account)
  @Column({ name: 'accountId' })
  accountId: string;

  @ManyToOne(
    () => OperationTypeEntity,
    (operationType) => operationType.operations,
  )
  operationType: OperationTypeEntity;

  @RelationId((operation: OperationEntity) => operation.operationType)
  @Column({ name: 'operationTypeId' })
  operationTypeId: number;

  @ManyToOne(
    () => FlowIndicatorEntity,
    (flowIndicator) => flowIndicator.operations,
  )
  flowIndicator: FlowIndicatorEntity;

  @RelationId((operation: OperationEntity) => operation.flowIndicator)
  @Column({ name: 'flowIndicatorId' })
  flowIndicatorId: number;
}
