export class LoginRequest {
  constructor(
    public readonly identifier: string,
    public readonly password: string,
  ) {}
}
