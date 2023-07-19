import { IDateProvider } from '../application/_ports/date-provider.iport';

export class DateProvider implements IDateProvider {
  getNow(): Date {
    return new Date();
  }
}
