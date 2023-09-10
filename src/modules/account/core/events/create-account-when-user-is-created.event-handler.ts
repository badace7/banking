import { UserCreatedEvent } from 'src/modules/authentication/core/domain/events/user-created.event';

import { OnEvent } from '@nestjs/event-emitter';
import { ICreateAccountWhenUserIsCreated } from '../_ports/usecases/create-account-when-user-is-created.iport';
import { IAccountPort } from '../_ports/repositories/account.iport';

export class CreateAccountWhenUserIsCreated
  implements ICreateAccountWhenUserIsCreated
{
  constructor(private readonly accountAdapter: IAccountPort) {}

  @OnEvent(UserCreatedEvent.name, { async: true, promisify: true })
  async execute(event: UserCreatedEvent): Promise<void> {
    console.log('CREATE ACCOUNT WHEN USER IS CREATED: ', event);
  }
}
