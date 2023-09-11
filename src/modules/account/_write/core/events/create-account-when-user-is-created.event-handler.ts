import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/modules/authentication/core/domain/events/user-created.event';
import { v4 } from 'uuid';
import { IAccountPort } from '../_ports/repositories/account.iport';
import { ICreateAccountWhenUserIsCreated } from '../_ports/usecases/create-account-when-user-is-created.iport';
import Account from '../domain/account';

export class CreateAccountWhenUserIsCreated
  implements ICreateAccountWhenUserIsCreated
{
  constructor(private readonly accountAdapter: IAccountPort) {}

  @OnEvent(UserCreatedEvent.name, { async: true, promisify: true })
  async execute(event: UserCreatedEvent): Promise<void> {
    const account = Account.create({
      id: v4(),
      balance: 0,
      user: event.payload.id,
      overdraftFacility: 0,
    });

    await this.accountAdapter.saveBankAccount(account);
  }
}
