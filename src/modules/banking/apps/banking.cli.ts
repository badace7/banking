import { Command, CommandRunner } from 'nest-commander';
import { MoneyTransferCommand } from '../application/commands/transfer.command';
import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';

@Command({
  name: 'transfer',
  arguments: '<label> <amount> <origin> <destination>',
})
export class TransferMoneyCommand extends CommandRunner {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }
  async run(passedParams: string[]): Promise<void> {
    try {
      const command = new MoneyTransferCommand(
        uuidv4(),
        passedParams[0],
        parseInt(passedParams[1]),
        passedParams[2],
        passedParams[3],
      );
      await this.commandBus.execute(command);
      console.log('transfer was successful');
      process.exit(0);
    } catch (error: any) {
      console.log(error);
      process.exit(1);
    }
  }
}
