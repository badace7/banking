import { CreateUser } from '../core/usecases/create-user.usecase';
import { CreateUserRequest } from '../core/usecases/create-user.request';

import { ICredentialProvider } from '../core/_ports/repositories/credential-provider.iport';
import { FakeCredientialProvider } from '../adapters/secondary/in-memory/crendential-provider.fake.adapter';
import { InMemoryUserAdapter } from '../adapters/secondary/in-memory/in-memory-user.adapter';
import { BcryptProvider } from '../adapters/secondary/providers/bcrypt-provider.adapter';
import { IEventPublisher } from '../core/_ports/repositories/event-publisher.iport';
import { FakeEventPublisher } from 'src/modules/account/adapters/secondary/in-memory/event-publisher.fake.adapter';

describe('Feature: create a user', () => {
  let userRepository: InMemoryUserAdapter;
  let bcryptAdapter: BcryptProvider;
  let createUserUsecase: CreateUser;
  let credentialProvider: ICredentialProvider;
  let eventPublisher: IEventPublisher;

  beforeEach(() => {
    userRepository = new InMemoryUserAdapter();
    bcryptAdapter = new BcryptProvider();
    credentialProvider = new FakeCredientialProvider();
    eventPublisher = new FakeEventPublisher();
    createUserUsecase = new CreateUser(
      userRepository,
      bcryptAdapter,
      credentialProvider,
      eventPublisher,
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
