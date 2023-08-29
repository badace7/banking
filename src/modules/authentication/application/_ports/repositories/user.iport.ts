import { User } from '../../../domain/user';

export const USER_PORT = 'IUserPort';

export interface IUserPort {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User>;
  findByIdentifier(identifier: string): Promise<User>;
}
