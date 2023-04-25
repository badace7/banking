import { AccountEntity } from 'src/infrastructure/account/entities/account.entity';
import { CustomerEntity } from 'src/infrastructure/customer/customer.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1673536730377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create<CustomerEntity>(CustomerEntity, {
        id: '1',
        firstName: 'Bob',
        lastName: 'Dylan',
        accountNumber: '98797897897',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<CustomerEntity>(CustomerEntity, {
        id: '2',
        firstName: 'Jack',
        lastName: 'Fisher',
        accountNumber: '12312312312',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<AccountEntity>(AccountEntity, {
        number: '98797897897',
        balance: 1000,
        customer: '1',
        overdraftFacility: 500,
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<AccountEntity>(AccountEntity, {
        number: '12312312312',
        balance: 1000,
        customer: '2',
        overdraftFacility: 500,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM customers`);
    await queryRunner.query(`DELETE * FROM accounts`);
    await queryRunner.query(`DELETE * FROM transactions`);
  }
}
