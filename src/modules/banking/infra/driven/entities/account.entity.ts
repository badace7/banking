import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OperationEntity } from './operation.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  number: string;
  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;
  @Column()
  user: string;
  @Column()
  overdraftFacility: number;

  @OneToMany(() => OperationEntity, (operation) => operation.account)
  operations: OperationEntity[];
}
