//TODO ADD PROPERTY CODE TYPE ERROR => ENUM
//TODO UNEXPECTED ERROR
export class UsecaseError extends Error {
  readonly message;
  constructor(message: string) {
    super();
    this.message = message;
  }
}
