export const DATE_PORT = 'IDateAdapter';

export interface IDateProvider {
  getNow(): Date;
  toFormatedDate(date: Date): string;
}
