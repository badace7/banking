import { IUserPort } from 'src/modules/authentication/core/_ports/repositories/user.iport';
import { Role } from 'src/modules/authentication/core/domain/role';
import { User } from 'src/modules/authentication/core/domain/user';

export class InMemoryUserAdapter implements IUserPort {
  deleteRefreshToken(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private users = new Map<string, User>();
  private roles = new Map<number, Role>([[1, new Role(1, 'CUSTOMER')]]);

  save(user: User) {
    this.users.set(user.data.id, user);
    return Promise.resolve();
  }

  getAll(): Promise<User[]> {
    return Promise.resolve([...this.users.values()]);
  }

  findById(id: string): Promise<User> {
    return Promise.resolve(this.users.get(id));
  }
  findByIdentifier(identifier: string): Promise<User> {
    return Promise.resolve(
      [...this.users.values()].find(
        (user) => user.data.identifier === identifier,
      ),
    );
  }

  findRoleById(id: number): Promise<Role> {
    return Promise.resolve(this.roles.get(id));
  }
}
