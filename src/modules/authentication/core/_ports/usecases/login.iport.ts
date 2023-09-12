import { LoginRequest } from '../../usecases/login.request';

export const LOGIN_PORT = 'ILogin';

export interface ILogin {
  execute(command: LoginRequest): Promise<any>;
}
