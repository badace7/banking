import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { AccountEntity } from 'src/modules/account/infra/driven/entities/account.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  identifier: string;
  @Column()
  password: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  roleId: number;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @OneToMany(() => AccountEntity, (accounts) => accounts.user)
  accounts: AccountEntity[];
}
