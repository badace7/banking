import { IDateProvider } from '../../application/_ports/driven/date-provider.iport';

export class StubDateProvider implements IDateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}
