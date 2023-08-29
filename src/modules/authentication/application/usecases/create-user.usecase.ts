import { Credentials } from '../../domain/credential';
import { Role, User } from '../../domain/user';
import { InMemoryUserAdapter } from '../../infra/driven/in-memory/in-memory-user.adapter';
import { IBcryptProvider } from '../_ports/repositories/bcrypt-provider.iport';

import { ICredentialProvider } from '../_ports/repositories/credential-provider.iport';
import { ICreateUser } from '../_ports/usecases/create-user.iport';
import { CreateUserRequest } from './create-user.request';

export class CreateUser implements ICreateUser {
  constructor(
    private readonly userRepository: InMemoryUserAdapter,
    private readonly bcryptAdapter: IBcryptProvider,
    private readonly credentialProvider: ICredentialProvider,
  ) {}
  async execute(request: CreateUserRequest): Promise<Credentials> {
    const identifier = await this.credentialProvider.generateIdentifier();
    const password = await this.credentialProvider.generatePassword();

    const credentials = new Credentials(identifier, password);

    const hashedPassword = await this.bcryptAdapter.hash(
      credentials.data.password,
    );

    const user = new User(
      request.id,
      credentials.data.identifier,
      hashedPassword,
      request.firstName,
      request.lastName,
      Role.CUSTOMER,
    );

    await this.userRepository.save(user);

    return credentials;
  }
}
