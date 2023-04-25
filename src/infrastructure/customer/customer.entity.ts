import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  accountNumber: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
}
