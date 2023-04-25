import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryColumn()
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
