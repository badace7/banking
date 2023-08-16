import { Separator, input, select } from '@inquirer/prompts';

export class CustomPrompt {
  public async operationsPrompt() {
    return await select({
      message: 'What type of operation do you want to do ?',
      choices: [
        new Separator('-- Operations --'),
        {
          name: 'Transfer',
          value: 'transfer',
          description:
            'Allows you to transfer money to the account of your choice',
        },
        {
          name: 'Deposit',
          value: 'deposit',
          description: 'Allows you to deposit money on your account',
        },
        {
          name: 'Withdraw',
          value: 'withdraw',
          description: 'Allows you to withdraw money on your account',
        },
        {
          name: 'View operations',
          value: 'view-operations',
          description: 'Allows you to view your operations',
        },
        {
          name: 'View balance',
          value: 'view-balance',
          description: 'Allows you to view your account balance',
        },
        new Separator('---------------'),
        {
          name: 'Cancel',
          value: 'cancel',
        },
      ],
    });
  }

  public async depositPrompt() {
    const origin: string = await this.getAccountNumberPrompt();
    const amount: string = await input({
      message: 'What is the amount ?',
    });
    return {
      origin,
      amount,
    };
  }

  public async withdrawPrompt() {
    const origin: string = await this.getAccountNumberPrompt();
    const amount: string = await input({
      message: 'What is the amount ?',
    });

    return {
      origin,
      amount,
    };
  }

  public async transferPrompt() {
    const origin: string = await this.getAccountNumberPrompt();
    const destination: string = await input({
      message: 'Who is at the destination of transfer ?',
    });
    const amount: string = await input({
      message: 'What is the amount ?',
    });
    const label: string = await input({
      message: 'What is the label ?',
    });

    return {
      origin,
      destination,
      amount,
      label,
    };
  }

  public async getAccountNumberPrompt() {
    const accountNumber: string = await input({
      message: 'What is your account number ?',
    });
    return accountNumber;
  }
}
