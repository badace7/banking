import { CustomerEntity } from 'src/modules/authentication/infra/customer/customer.entity';
import { AccountEntity } from 'src/modules/banking/infra/account.entity';
import { OperationType } from 'src/modules/banking/infra/operation-type.entity';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class migrations1673536730377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'accountNumber',
            type: 'varchar',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'number',
            type: 'varchar',
          },
          {
            name: 'balance',
            type: 'varchar',
          },
          {
            name: 'customer',
            type: 'varchar',
          },
          {
            name: 'overdraftFacility',
            type: 'integer',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'operations_types',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'type',
            type: 'integer',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'operations',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'amount',
            type: 'float',
          },
          {
            name: 'origin',
            type: 'varchar',
          },
          {
            name: 'destination',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'label',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'integer',
          },
        ],
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<CustomerEntity>(CustomerEntity, {
        id: '1',
        firstName: 'Bob',
        lastName: 'Dylan',
        accountNumber: '98797897897',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<OperationType>(OperationType, {
        id: 1,
        type: 1,
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<OperationType>(OperationType, {
        id: 2,
        type: 2,
      }),
    );
    await queryRunner.manager.save(
      queryRunner.manager.create<OperationType>(OperationType, {
        id: 3,
        type: 3,
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
        id: '1',
        number: '98797897897',
        balance: 1000,
        customer: '1',
        overdraftFacility: 500,
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<AccountEntity>(AccountEntity, {
        id: '2',
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
    await queryRunner.query(`DELETE * FROM operations_types`);
    await queryRunner.query(`DELETE * FROM operations`);
  }
}
