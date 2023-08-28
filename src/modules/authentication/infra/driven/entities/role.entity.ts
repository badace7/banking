import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryColumn()
  public id: number;

  @Column({ unique: true })
  public role: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  public user: UserEntity[];
}
