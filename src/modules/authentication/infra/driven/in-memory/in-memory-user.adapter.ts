import { IUserPort } from 'src/modules/authentication/application/_ports/user.iport';
import { User } from 'src/modules/authentication/domain/user';

export class InMemoryUserAdapter implements IUserPort {
  private users = new Map<string, User>();

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
}
