export const DATE_PORT = 'IDateProvider';

export interface IDateProvider {
  getNow(): Date;
  toFormatedDate(date: Date): string;
}
