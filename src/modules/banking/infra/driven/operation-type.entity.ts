import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('operations_types')
export class OperationTypeEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  type: number;
}
