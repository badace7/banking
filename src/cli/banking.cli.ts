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
      console.log(
        '\x1b[36m',
        `                                                                                                                                          
                                                            ''''''bbbbbbbb                                                               
  DDDDDDDDDDDDD          iiii                        iiii   '::::'b::::::b                                               kkkkkkkk           
  D::::::::::::DDD      i::::i                      i::::i  '::::'b::::::b                                               k::::::k           
  D:::::::::::::::DD     iiii                        iiii   ':::''b::::::b                                               k::::::k           
  DDD:::::DDDDD:::::D                                      ':::'   b:::::b                                               k::::::k           
  D:::::D    D:::::D iiiiiii    ggggggggg   gggggiiiiiii ''''    b:::::bbbbbbbbb      aaaaaaaaaaaaa  nnnn  nnnnnnnn     k:::::k    kkkkkkk
  D:::::D     D:::::Di:::::i   g:::::::::ggg::::gi:::::i         b::::::::::::::bb    a::::::::::::a n:::nn::::::::nn   k:::::k   k:::::k 
  D:::::D     D:::::D i::::i  g:::::::::::::::::g i::::i         b::::::::::::::::b   aaaaaaaaa:::::an::::::::::::::nn  k:::::k  k:::::k  
  D:::::D     D:::::D i::::i g::::::ggggg::::::gg i::::i         b:::::bbbbb:::::::b           a::::ann:::::::::::::::n k:::::k k:::::k   
  D:::::D     D:::::D i::::i g:::::g     g:::::g  i::::i         b:::::b    b::::::b    aaaaaaa:::::a  n:::::nnnn:::::n k::::::k:::::k    
  D:::::D     D:::::D i::::i g:::::g     g:::::g  i::::i         b:::::b     b:::::b  aa::::::::::::a  n::::n    n::::n k:::::::::::k     
  D:::::D     D:::::D i::::i g:::::g     g:::::g  i::::i         b:::::b     b:::::b a::::aaaa::::::a  n::::n    n::::n k:::::::::::k     
  D:::::D    D:::::D  i::::i g::::::g    g:::::g  i::::i         b:::::b     b:::::ba::::a    a:::::a  n::::n    n::::n k::::::k:::::k    
  D:::::DDDDD:::::D  i::::::ig:::::::ggggg:::::g i::::::i        b:::::bbbbbb::::::ba::::a    a:::::a  n::::n    n::::nk::::::k k:::::k   
  D:::::::::::::DD   i::::::i g::::::::::::::::g i::::::i        b::::::::::::::::b a:::::aaaa::::::a  n::::n    n::::nk::::::k  k:::::k  
  D::::::::::DDD     i::::::i  gg::::::::::::::g i::::::i        b:::::::::::::::b   a::::::::::aa:::a n::::n    n::::nk::::::k   k:::::k 
  DDDDDDDDDDD        iiiiiiii    gggggggg::::::g iiiiiiii        bbbbbbbbbbbbbbbb     aaaaaaaaaa  aaaa nnnnnn    nnnnnnkkkkkkkk    kkkkkkk
                                         g:::::g                                                                                          
                             gggggg      g:::::g                                                                                          
                             g:::::gg   gg:::::g                                                                                          
                             g::::::ggg:::::::g                                                                                          
                              gg:::::::::::::g                                                                                           
                                ggg::::::ggg                                                                                             
                                   gggggg                                                                                                






`,
      );

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
          disabled: 'Not disponible',
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
