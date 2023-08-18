import { IDateProvider } from '../../../application/_ports/repositories/date-provider.iport';

export class StubDateProvider implements IDateProvider {
  toFormatedDate(date: Date): string {
    throw new Error('Method not implemented.');
  }
  now: Date;
  getNow(): Date {
    return this.now;
  }
}
