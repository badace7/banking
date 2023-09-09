import { Test, TestingModule } from '@nestjs/testing';
import { createEntityManagerProvider } from 'src/config/postgres.config';

import { EntityManager } from 'typeorm';
import { User } from '../core/domain/user';

import { Role } from '../core/domain/role';
import {
  TestContainersType,
  CreateTestContainer,
} from 'src/modules/account/tests/configs/test-containers.config';
import { TestDatabaseModule } from 'src/modules/account/tests/configs/test-database.module';
import { UserEntity } from '../adapters/secondary/entities/user.entity';
import { UserMapper } from '../adapters/secondary/mappers/user.mapper';
import { UserPostgresAdapter } from '../adapters/secondary/postgres/user.postgres.adapter';

describe('user adapter', () => {
  let container: TestContainersType;
  let entityManager: EntityManager;
  let userAdapter: UserPostgresAdapter;

  beforeAll(async () => {
    container = await CreateTestContainer();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule.forRoot(container)],
      providers: [UserPostgresAdapter, createEntityManagerProvider],
    }).compile();

    entityManager = moduleFixture.get<EntityManager>(EntityManager);

    userAdapter = moduleFixture.get<UserPostgresAdapter>(UserPostgresAdapter);
  });

  afterAll(async () => {
    await container.stop();
  });

  test('save() should save a user ', async () => {
    //arrange
    const user = User.create({
      id: 'abc',
      identifier: '45645645645',
      password: '456456',
      firstName: 'John',
      lastName: 'Do',
      role: new Role(1, 'CUSTOMER'),
    });

    //act
    await userAdapter.save(user);

    //assert
    const result = await entityManager.getRepository(UserEntity).findOne({
      where: { id: user.data.id },
      relations: ['role'],
    });

    const expected = UserMapper.toDomain(result);
    expect(expected).toEqual(user);
  });

  test('findById() should return a user ', async () => {
    //arrange
    const user = User.create({
      id: 'abc',
      identifier: '45645645645',
      password: '456456',
      firstName: 'John',
      lastName: 'Do',
      role: new Role(1, 'CUSTOMER'),
    });

    //act
    const result = await userAdapter.findById(user.data.id);

    //assert
    expect(result).toEqual(user);
  });

  test('findByIdentifier() should return a user', async () => {
    //arrange
    const user = User.create({
      id: 'abc',
      identifier: '45645645645',
      password: '456456',
      firstName: 'John',
      lastName: 'Do',
      role: new Role(1, 'CUSTOMER'),
    });

    //act
    const result = await userAdapter.findByIdentifier(user.data.identifier);

    //assert
    expect(result).toEqual(user);
  });

  test('findAccountNumberByUserId() should return user account number', async () => {
    //arrange
    const userId = '1';

    //act
    const result = await userAdapter.findAccountNumberByUserId(userId);

    //assert
    expect(result).toBe('98797897897');
  });

  test('findRoleById() should return a role', async () => {
    //arrange
    const roleId = 1;

    //act
    const result = await userAdapter.findRoleById(roleId);

    //assert
    expect(result).toEqual(new Role(1, 'CUSTOMER'));
  });
});
