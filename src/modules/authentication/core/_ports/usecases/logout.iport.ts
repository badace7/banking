import { LogoutRequest } from '../../usecases/logout.request';

export const LOGOUT_PORT = 'ILogout';

export interface ILogout {
  execute(request: LogoutRequest): Promise<void>;
}
