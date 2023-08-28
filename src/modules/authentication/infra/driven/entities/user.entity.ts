import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { RoleEntity } from './role.entity';

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

  @ManyToOne(() => RoleEntity, (role) => role.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @RelationId((user: UserEntity) => user.role)
  @Column({ name: 'roleId' })
  roleId: number;
}
