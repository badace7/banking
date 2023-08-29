import { CreateUser } from '../application/usecases/create-user.usecase';
import { CreateUserRequest } from '../application/usecases/create-user.request';
import { InMemoryUserAdapter } from '../infra/driven/in-memory/in-memory-user.adapter';
import { BcryptProvider } from '../infra/driven/providers/bcrypt-provider.adapter';
import { ICredentialProvider } from '../application/_ports/repositories/credential-provider.iport';
import { FakeCredientialProvider } from '../infra/driven/in-memory/crendential-provider.fake.adapter';

describe('Feature: create a user', () => {
  let userRepository: InMemoryUserAdapter;
  let bcryptAdapter: BcryptProvider;
  let createUserUsecase: CreateUser;
  let credentialProvider: ICredentialProvider;

  beforeEach(() => {
    userRepository = new InMemoryUserAdapter();
    bcryptAdapter = new BcryptProvider();
    credentialProvider = new FakeCredientialProvider();
    createUserUsecase = new CreateUser(
      userRepository,
      bcryptAdapter,
      credentialProvider,
    );
  });

  describe('Rule: create a user', () => {
    it('should create a user with hashed password', async () => {
      // Arrange
      const createUserCommand: CreateUserRequest = new CreateUserRequest(
        'abc',
        'Jack',
        'Sparrow',
      );
      const passwordGenerated = '123123';

      // Act
      await createUserUsecase.execute(createUserCommand);

      // Assert
      const user = await userRepository.findById(createUserCommand.id);
      expect(user.data).toMatchObject(createUserCommand);
      expect(
        await bcryptAdapter.compare(passwordGenerated, user.data.password),
      ).toBe(true);
    });
  });
});
