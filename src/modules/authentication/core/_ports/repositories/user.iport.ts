import { Role } from 'src/modules/authentication/core/domain/role';
import { User } from '../../domain/user';

export const USER_PORT = 'IUserPort';

export interface IUserPort {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User>;
  findByIdentifier(identifier: string): Promise<User>;
  findRoleById(id: number): Promise<Role>;
  updateRefreshToken(id: string, refreshToken: string): Promise<void>;
  findUserRefreshToken(id: string): Promise<string>;
}
