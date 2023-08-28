import { CreateUser } from '../application/commands/create-user.usecase';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { InMemoryUserAdapter } from '../infra/driven/in-memory/in-memory-user.adapter';
import { BcryptProvider } from '../infra/driven/providers/bcrypt-provider.adapter';
import { ICredentialProvider } from '../application/_ports/credential-provider.iport';
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
      const createUserCommand: CreateUserCommand = new CreateUserCommand(
        'abc',
        '12312312312',
        '123123',
        'Jack',
        'Sparrow',
      );
      // Act
      await createUserUsecase.execute(createUserCommand);

      // Assert
      const user = await userRepository.findById(createUserCommand.id);

      expect(
        await bcryptAdapter.compare(
          createUserCommand.password,
          user.data.password,
        ),
      ).toBe(true);
    });
  });
});
