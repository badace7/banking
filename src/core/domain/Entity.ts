import { v4 as createUUIDv4 } from 'uuid';

export abstract class Entity {
  protected readonly id?: string;
  constructor(id?: string) {
    this.id = id ? id : createUUIDv4();
  }

  getId(): string {
    return this.id;
  }
}
