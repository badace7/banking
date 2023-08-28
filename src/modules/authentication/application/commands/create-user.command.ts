export class CreateUserCommand {
  constructor(
    public readonly id: string,
    public readonly identifier: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}
