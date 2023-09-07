export class Role {
  constructor(private _id: number, private _role: string) {}

  get data() {
    return {
      id: this._id,
      role: this._role,
    };
  }
}
