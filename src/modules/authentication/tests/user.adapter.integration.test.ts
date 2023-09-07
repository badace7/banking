import { Test, TestingModule } from '@nestjs/testing';
import { createEntityManagerProvider } from 'src/config/postgres.config';
import {
  CreateTestContainer,
  TestContainersType,
} from 'src/modules/banking/tests/configs/test-containers.config';
import { TestDatabaseModule } from 'src/modules/banking/tests/configs/test-database.module';
import { EntityManager } from 'typeorm';
import { RoleEnum, User } from '../domain/user';
import { UserEntity } from '../infra/driven/entities/user.entity';
import { UserPostgresAdapter } from '../infra/driven/postgres/user.postgres.adapter';
import { UserMapper } from '../infra/driven/mappers/user-mapper';
import { Role } from '../domain/role';

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
    const user = new User(
      'abc',
      '45645645645',
      '456456',
      'John',
      'Do',
      new Role(1, 'CUSTOMER'),
    );

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
    const user = new User(
      'abc',
      '45645645645',
      '456456',
      'John',
      'Do',
      new Role(1, 'CUSTOMER'),
    );

    //act
    const result = await userAdapter.findById(user.data.id);

    //assert
    expect(result).toEqual(user);
  });

  test('findByIdentifier() should return a user', async () => {
    //arrange
    const user = new User(
      'abc',
      '45645645645',
      '456456',
      'John',
      'Do',
      new Role(1, 'CUSTOMER'),
    );

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

  test.only('findRoleById() should return a role', async () => {
    //arrange
    const roleId = 1;

    //act
    const result = await userAdapter.findRoleById(roleId);

    //assert
    expect(result).toEqual(new Role(1, 'CUSTOMER'));
  });
});
