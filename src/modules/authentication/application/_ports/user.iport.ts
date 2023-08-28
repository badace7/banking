import { User } from '../../domain/user';

export interface IUserPort {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User>;
  findByIdentifier(identifier: string): Promise<User>;
}
