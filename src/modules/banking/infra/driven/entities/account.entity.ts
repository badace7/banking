import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { OperationEntity } from './operation.entity';
import { UserEntity } from 'src/modules/authentication/infra/driven/entities/user.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  number: string;
  @Column()
  balance: number;
  @Column()
  overdraftFacility: number;

  @OneToMany(() => OperationEntity, (operation) => operation.account)
  operations: OperationEntity[];

  @ManyToOne(() => UserEntity, (user) => user.accounts)
  user: UserEntity;

  @Column({ name: 'userId' })
  userId: string;
}
