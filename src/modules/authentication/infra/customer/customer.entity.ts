import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  accountNumber: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
}
