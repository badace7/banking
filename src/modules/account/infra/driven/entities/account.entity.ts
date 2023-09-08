import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from 'src/modules/authentication/infra/driven/entities/user.entity';
import { OperationEntity } from 'src/modules/operation/infra/operation.entity';

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
