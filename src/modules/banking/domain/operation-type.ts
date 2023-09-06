export class OperationType {
  public constructor(
    private readonly _id: number,
    private readonly _type: string,
  ) {}

  get data() {
    return {
      id: this._id,
      type: this._type,
    };
  }
}
