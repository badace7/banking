import { IUserPort } from 'src/modules/authentication/application/_ports/repositories/user.iport';
import { Role } from 'src/modules/authentication/domain/role';
import { User } from 'src/modules/authentication/domain/user';

export class InMemoryUserAdapter implements IUserPort {
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
