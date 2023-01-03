export class UsecaseError extends Error {
  readonly message;
  constructor(message: string) {
    super();
    this.message = message;
  }
}
