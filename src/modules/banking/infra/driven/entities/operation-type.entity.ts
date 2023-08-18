import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OperationEntity } from './operation.entity';

@Entity('operations_types')
export class OperationTypeEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  type: string;
  @OneToMany(() => OperationEntity, (operation) => operation.operationType)
  operations: OperationEntity[];
}
