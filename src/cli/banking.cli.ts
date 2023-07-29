import { Command, CommandRunner } from 'nest-commander';
import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { input } from '@inquirer/prompts';
import select, { Separator } from '@inquirer/select';
import { WithdrawCommand } from 'src/modules/banking/application/commands/withdraw.command';
import { DepositCommand } from 'src/modules/banking/application/commands/deposit.command';
import { MoneyTransferCommand } from 'src/modules/banking/application/commands/transfer.command';

@Command({
  name: 'banking',
  options: { isDefault: true },
})
export class BankingCli extends CommandRunner {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }
  async run(): Promise<void> {
    try {
      const choice = await this.operationsPrompt();
      await this.execOperationByChoice(choice);
    } catch (error: any) {
      console.log(error);
      process.exit(1);
    }
  }

  private async execOperationByChoice(choice: string) {
    if (choice === 'transfer') {
      await this.transferPrompt();
    }

    if (choice === 'deposit') {
      await this.depositPrompt();
    }

    if (choice === 'withdraw') {
      await this.withdrawPrompt();
    }

    if (choice === 'cancel') {
      console.log('Ok, bye');
      process.exit(0);
    }
  }

  private async withdrawPrompt() {
    const origin: string = await input({
      message: 'Who is at the origin of withdraw ?',
    });
    const amount: string = await input({
      message: 'What is the amount ?',
    });

    const command = new WithdrawCommand(uuidv4(), origin, parseInt(amount));

    await this.commandBus.execute(command);
    console.log('Withdraw was successful');
    process.exit(0);
  }

  private async depositPrompt() {
    const origin: string = await input({
      message: 'Who is at the origin of deposit ?',
    });
    const amount: string = await input({
      message: 'What is the amount ?',
    });

    const command = new DepositCommand(uuidv4(), origin, parseInt(amount));

    await this.commandBus.execute(command);
    console.log('Deposit was successful');
    process.exit(0);
  }

  private async transferPrompt() {
    const origin: string = await input({
      message: 'Who is at the origin of transfer ?',
    });
    const destination: string = await input({
      message: 'Who is at the destination of transfer ?',
    });
    const amount: string = await input({
      message: 'What is the amount ?',
    });
    const label: string = await input({
      message: 'What is the label ?',
    });

    const command = new MoneyTransferCommand(
      uuidv4(),
      label,
      parseInt(amount),
      origin,
      destination,
    );

    await this.commandBus.execute(command);
    console.log('Deposit was successful');
    process.exit(0);
  }

  private async operationsPrompt() {
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
          disabled: 'Deposit is not disponible for the moment',
        },
        {
          name: 'Withdraw',
          value: 'withdraw',
          description: 'Allows you to withdraw money on your account',
        },
        new Separator('---------------'),
        {
          name: 'Cancel',
          value: 'cancel',
        },
      ],
    });
  }
}
