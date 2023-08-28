import { Role, User } from '../../domain/user';
import { InMemoryUserAdapter } from '../../infra/driven/in-memory/in-memory-user.adapter';
import { BcryptProvider } from '../../infra/driven/providers/bcrypt-provider.adapter';

import { ICredentialProvider } from '../_ports/credential-provider.iport';
import { CreateUserCommand } from './create-user.command';

export class CreateUser {
  constructor(
    private readonly userRepository: InMemoryUserAdapter,
    private readonly bcryptAdapter: BcryptProvider,
    private readonly credentialProvider: ICredentialProvider,
  ) {}
  async execute(command: CreateUserCommand) {
    const identifier = this.credentialProvider.generateIdentifier();
    const password = this.credentialProvider.generatePassword();

    const hashedPassword = await this.bcryptAdapter.hash(password);

    const user = new User(
      command.id,
      identifier,
      hashedPassword,
      command.firstName,
      command.lastName,
      Role.CUSTOMER,
    );

    await this.userRepository.save(user);
  }
}
