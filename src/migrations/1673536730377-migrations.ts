import * as bcrypt from 'bcryptjs';
import { AccountEntity } from 'src/modules/account/_write/adapters/secondary/entities/account.entity';

import { RoleEntity } from 'src/modules/authentication/adapters/secondary/entities/role.entity';
import { UserEntity } from 'src/modules/authentication/adapters/secondary/entities/user.entity';
import { FlowIndicatorEntity } from 'src/modules/operation/_write/adapters/flow-indicator.entity';
import { OperationTypeEntity } from 'src/modules/operation/_write/adapters/operation-type.entity';

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
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'role',
            type: 'varchar',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'identifier',
            isUnique: true,
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
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
            name: 'refreshToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'roleId',
            type: 'integer',
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
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'userId',
            type: 'varchar',
          },
          {
            name: 'overdraftFacility',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
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
            type: 'decimal',
            precision: 10,
            scale: 2,
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

    await queryRunner.createForeignKeys('users', [
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
      }),
    ]);

    await queryRunner.createForeignKeys('accounts', [
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    ]);

    await queryRunner.manager.save(
      queryRunner.manager.create<RoleEntity>(RoleEntity, {
        id: 1,
        role: 'CUSTOMER',
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<UserEntity>(UserEntity, {
        id: '1',
        identifier: '98797897897',
        password: await bcrypt.hash('978978', 12),
        firstName: 'Jack',
        lastName: 'Sparrow',
        refreshToken: null,
        roleId: 1,
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<UserEntity>(UserEntity, {
        id: '2',
        identifier: '12312312312',
        password: await bcrypt.hash('123123', 12),
        firstName: 'Bob',
        lastName: 'Dylan',
        refreshToken: null,
        roleId: 1,
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
        userId: '1',
        overdraftFacility: 500,
      }),
    );

    await queryRunner.manager.save(
      queryRunner.manager.create<AccountEntity>(AccountEntity, {
        id: '2',
        number: '12312312312',
        balance: 1000,
        userId: '2',
        overdraftFacility: 500,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles`);
    await queryRunner.query(`DELETE FROM users`);
    await queryRunner.query(`DELETE FROM accounts`);
    await queryRunner.query(`DELETE FROM operations_types`);
    await queryRunner.query(`DELETE FROM operations`);
    await queryRunner.query(`DELETE FROM flow_indicators`);
  }
}
