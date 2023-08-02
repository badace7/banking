import { UserEntity } from 'src/modules/authentication/infra/customer/customer.entity';
import { AccountEntity } from 'src/modules/banking/infra/driven/account.entity';
import { FlowIndicatorEntity } from 'src/modules/banking/infra/driven/flow-indicator.entity';
import { OperationTypeEntity } from 'src/modules/banking/infra/driven/operation-type.entity';

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

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
            type: 'varchar',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'flow_indicators',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'indicator',
            type: 'varchar',
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
            name: 'label',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'float',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'accountId',
            type: 'varchar',
          },
          {
            name: 'operationTypeId',
            type: 'integer',
          },
          {
            name: 'flowIndicatorId',
            type: 'integer',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('operations', [
      new TableForeignKey({
        columnNames: ['accountId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['operationTypeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations_types',
      }),
      new TableForeignKey({
        columnNames: ['flowIndicatorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'flow_indicators',
      }),
    ]);

    await queryRunner.manager.save(
      queryRunner.manager.create<UserEntity>(UserEntity, {
        id: '1',
        firstName: 'Bob',
        lastName: 'Dylan',
        accountNumber: '98797897897',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<UserEntity>(UserEntity, {
        id: '2',
        firstName: 'Jack',
        lastName: 'Fisher',
        accountNumber: '12312312312',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<OperationTypeEntity>(OperationTypeEntity, {
        id: 1,
        type: 'WITHDRAW',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<OperationTypeEntity>(OperationTypeEntity, {
        id: 2,
        type: 'DEPOSIT',
      }),
    );
    await queryRunner.manager.save(
      queryRunner.manager.create<OperationTypeEntity>(OperationTypeEntity, {
        id: 3,
        type: 'TRANSFER',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<FlowIndicatorEntity>(FlowIndicatorEntity, {
        id: 1,
        indicator: 'DEBIT',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<FlowIndicatorEntity>(FlowIndicatorEntity, {
        id: 2,
        indicator: 'CREDIT',
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
    await queryRunner.query(`DELETE FROM customers`);
    await queryRunner.query(`DELETE FROM accounts`);
    await queryRunner.query(`DELETE FROM operations_types`);
    await queryRunner.query(`DELETE FROM operations`);
    await queryRunner.query(`DELETE FROM flow_indicators`);
  }
}
