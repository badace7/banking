import { Controller, HttpStatus, Post, Res, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CreateTransferCommand } from 'src/domain/account/commands/transfer.command';

@Controller('account')
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('transfer')
  async CreateAtransfer(@Body() body: any, @Res() response: Response) {
    try {
      const command = new CreateTransferCommand(body);
      await this.commandBus.execute(command);
      response.status(HttpStatus.OK).send('success');
    } catch (error) {
      console.error(error.message);
    }
  }
}
