import { logo } from './banking.logo';

export class CustomConsoleLogger {
  private readonly CYAN_COLOR = '\x1b[36m';
  private readonly RED_COLOR = '\x1b[31m';
  private readonly GREEN_COLOR = '\x1b[32m';
  private readonly LOGO = logo;

  displayLogo() {
    console.log(this.CYAN_COLOR, this.LOGO);
  }

  displaySuccess(message: string) {
    console.log(this.GREEN_COLOR, message);
  }

  displayError(error: string) {
    console.error(this.RED_COLOR, error);
  }

  displayTable(tabularData: any) {
    console.table(this.CYAN_COLOR, tabularData);
  }
}
