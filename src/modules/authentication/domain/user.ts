export enum Role {
  CUSTOMER = 1,
}

export class User {
  constructor(
    private _id: string,
    private _identifier: string,
    private _password: string,
    private _firstName: string,
    private _lastName: string,
    private _role: Role,
  ) {}

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
}
