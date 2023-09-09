import { Credentials } from 'src/modules/authentication/core/domain/credential';
import { CreateUserRequest } from '../../usecases/create-user.request';

export const CREATE_USER_PORT = 'ICreateUser';

export interface ICreateUser {
  execute(command: CreateUserRequest): Promise<Credentials>;
}
