import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  accountNumber: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
}
