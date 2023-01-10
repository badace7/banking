import { v4 as createUUIDv4 } from 'uuid';

export abstract class Entity<T> {
  protected readonly id?: string;
  public readonly properties: T;
  constructor(properties: T, id?: string) {
    this.id = id ? id : createUUIDv4();
    this.properties = properties;
  }

  getId(): string {
    return this.id;
  }
}
