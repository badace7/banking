import { IDateProvider } from '../../application/_ports/date-provider.iport';

export class StubDateProvider implements IDateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}
