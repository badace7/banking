import { Controller, HttpStatus, Post, Res, Body, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { MoneyTransferCommand } from '../application/commands/transfer.command';
import { v4 as uuidv4 } from 'uuid';

@Controller('banking')
export class BankingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('transfer')
  async CreateAtransfer(@Body() body: any, @Res() response: Response) {
    try {
      const command = new MoneyTransferCommand(
        uuidv4(),
        body.label,
        body.amount,
        body.origin,
        body.destination,
      );
      await this.commandBus.execute(command);
      response.status(HttpStatus.OK).send('The transfer was successful');
    } catch (error) {
      console.log(error);
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Get('test')
  async test(@Res() response: Response) {
    response.status(HttpStatus.OK).send('The transfer was successful');
  }
}
