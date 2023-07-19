import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('operations_types')
export class OperationType {
  @PrimaryColumn()
  id: number;
  @Column()
  type: number;
}
