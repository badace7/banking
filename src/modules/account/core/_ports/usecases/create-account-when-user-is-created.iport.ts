import { UserCreatedEvent } from 'src/modules/authentication/core/domain/events/user-created.event';

export const CREATE_ACCOUNT_PORT = 'ICreateAccountWhenUserIsCreated';

export interface ICreateAccountWhenUserIsCreated {
  execute(event: UserCreatedEvent): Promise<void>;
}
