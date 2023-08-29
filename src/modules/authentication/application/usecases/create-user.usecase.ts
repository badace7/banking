import { Credentials } from '../../domain/credential';
import { Role, User } from '../../domain/user';
import { InMemoryUserAdapter } from '../../infra/driven/in-memory/in-memory-user.adapter';
import { BcryptProvider } from '../../infra/driven/providers/bcrypt-provider.adapter';

import { ICredentialProvider } from '../_ports/repositories/credential-provider.iport';
import { ICreateUser } from '../_ports/usecases/create-user.iport';
import { CreateUserRequest } from './create-user.request';

export class CreateUser implements ICreateUser {
  constructor(
    private readonly userRepository: InMemoryUserAdapter,
    private readonly bcryptAdapter: BcryptProvider,
    private readonly credentialProvider: ICredentialProvider,
  ) {}
  async execute(request: CreateUserRequest): Promise<Credentials> {
    const identifier = this.credentialProvider.generateIdentifier();
    const password = this.credentialProvider.generatePassword();

    const credentials = new Credentials(identifier, password);

    const hashedPassword = await this.bcryptAdapter.hash(credentials.password);

    const user = new User(
      request.id,
      credentials.identifier,
      hashedPassword,
      request.firstName,
      request.lastName,
      Role.CUSTOMER,
    );

    await this.userRepository.save(user);

    return credentials;
  }
}
