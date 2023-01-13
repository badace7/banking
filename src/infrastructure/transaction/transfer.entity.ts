import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transfers')
export class TransferEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  label: string;
  @Column()
  from: string;
  @Column()
  to: string;
  @Column()
  date: Date;
}
