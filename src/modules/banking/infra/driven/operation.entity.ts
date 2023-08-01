import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('operations')
export class OperationEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  label: string;
  @Column()
  amount: number;
  @Column()
  account: string;
  @Column()
  date: Date;
  @Column()
  type: number;
}
