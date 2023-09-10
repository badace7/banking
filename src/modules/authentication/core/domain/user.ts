import { AggregateRoot } from 'src/libs/domain/aggregate.root';
import { Role } from './role';
import { UserCreatedEvent } from './events/user-created.event';

export enum RoleEnum {
  CUSTOMER = 1,
}

export class User extends AggregateRoot {
  get data() {
    return {
      id: this._id,
      identifier: this._identifier,
      password: this._password,
      firstName: this._firstName,
      lastName: this._lastName,
      role: this._role,
    };
  }

  private constructor(
    private _id: string,
    private _identifier: string,
    private _password: string,
    private _firstName: string,
    private _lastName: string,
    private _role: Role,
  ) {
    super();
  }

  static create(data: User['data']) {
    const user = new User(
      data.id,
      data.identifier,
      data.password,
      data.firstName,
      data.lastName,
      data.role,
    );
    user.addDomainEvent(new UserCreatedEvent(data.id, user));
    return user;
  }
}
