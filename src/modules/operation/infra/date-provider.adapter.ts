import { IDateProvider } from '../application/_ports/date-provider.iport';

export class DateProvider implements IDateProvider {
  toFormatedDate(date: Date): string {
    const day =
      date.getDate() < 10
        ? '0' + String(date.getDate())
        : String(date.getDate());
    const month =
      date.getMonth() + 1 < 10
        ? '0' + String(date.getMonth() + 1)
        : String(date.getMonth() + 1);
    const year = String(date.getFullYear());

    return `${day}-${month}-${year}`;
  }
  getNow(): Date {
    return new Date();
  }
}
