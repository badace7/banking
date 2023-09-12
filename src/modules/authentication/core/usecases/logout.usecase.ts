import { IUserPort } from '../_ports/repositories/user.iport';
import { ILogout } from '../_ports/usecases/logout.iport';
import { LogoutRequest } from './logout.request';

export class Logout implements ILogout {
  constructor(private readonly userRepository: IUserPort) {}

  async execute(request: LogoutRequest): Promise<void> {
    await this.userRepository.updateRefreshToken(request.id, null);
  }
}
