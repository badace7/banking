export class Credentials {
  constructor(
    private readonly identifier: string,
    private readonly password: string,
  ) {}

  get data() {
    return {
      identifier: this.identifier,
      password: this.password,
    };
  }
}
