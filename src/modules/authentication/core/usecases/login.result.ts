export class LoginResult {
  constructor(
    public readonly id: string,
    public readonly identifier: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly accessToken: string,
  ) {}
}
