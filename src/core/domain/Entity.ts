import { v4 as createUUIDv4 } from 'uuid';

export abstract class Entity<T> {
  protected readonly id?: string | number;
  protected properties: T;
  constructor(properties: T, id?: string | number) {
    this.id = id ? id : createUUIDv4();
    this.properties = properties;
  }
}
