import { Credentials } from '../domain/credential';
import { RoleEnum, User } from '../domain/user';
import { IBcryptProvider } from '../_ports/repositories/bcrypt-provider.iport';

import { ICredentialProvider } from '../_ports/repositories/credential-provider.iport';
import { IUserPort } from '../_ports/repositories/user.iport';
import { ICreateUser } from '../_ports/usecases/create-user.iport';
import { CreateUserRequest } from './create-user.request';
import { IEventPublisher } from '../_ports/repositories/event-publisher.iport';

export class CreateUser implements ICreateUser {
  constructor(
    private readonly userRepository: IUserPort,
    private readonly bcryptAdapter: IBcryptProvider,
    private readonly credentialProvider: ICredentialProvider,
    private readonly eventPublisher: IEventPublisher,
  ) {}
  async execute(request: CreateUserRequest): Promise<Credentials> {
    const identifier = await this.credentialProvider.generateIdentifier();
    const password = await this.credentialProvider.generatePassword();

    const credentials = new Credentials(identifier, password);

    const hashedPassword = await this.bcryptAdapter.hash(
      credentials.data.password,
    );

    const role = await this.userRepository.findRoleById(RoleEnum.CUSTOMER);

    const user = User.create({
      id: request.id,
      identifier: credentials.data.identifier,
      password: hashedPassword,
      firstName: request.firstName,
      lastName: request.lastName,
      role: role,
    });

    this.eventPublisher.publish(user.getDomainEvents());
    user.clearEvents();
    await this.userRepository.save(user);

    return credentials;
  }
}
