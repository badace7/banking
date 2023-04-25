import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  number: string;
  @Column()
  balance: number;
  @Column()
  customer: string;
  @Column()
  overdraftFacility: number;
}
