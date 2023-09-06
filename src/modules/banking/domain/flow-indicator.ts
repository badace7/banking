export class FlowIndicator {
  public constructor(
    private readonly _id: number,
    private readonly _indicator: string,
  ) {}

  get data() {
    return {
      id: this._id,
      indicator: this._indicator,
    };
  }
}
