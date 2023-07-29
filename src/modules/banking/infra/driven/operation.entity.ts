import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('operations')
export class OperationEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  amount: number;
  @Column()
  origin: string;
  @Column()
  destination: string;
  @Column()
  date: Date;
  @Column()
  label: string;
  @Column()
  type: number;
}
