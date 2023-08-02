import { IDateProvider } from '../../application/_ports/driven/date-provider.iport';

export class DateProvider implements IDateProvider {
  getNow(): Date {
    return new Date();
  }
}
