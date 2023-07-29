import { Controller, HttpStatus, Post, Res, Body, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { MoneyTransferCommand } from '../../application/commands/transfer.command';
import { v4 as uuidv4 } from 'uuid';
import { DepositCommand } from '../../application/commands/deposit.command';
import { WithdrawCommand } from '../../application/commands/withdraw.command';

@Controller('banking')
export class BankingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('transfer')
  async transferMoney(@Body() body: any, @Res() response: Response) {
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
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('deposit')
  async depositMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new DepositCommand(uuidv4(), body.origin, body.amount);
      await this.commandBus.execute(command);
      response.status(HttpStatus.OK).send('The deposit was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('withdraw')
  async withdrawMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new WithdrawCommand(uuidv4(), body.origin, body.amount);
      await this.commandBus.execute(command);
      response.status(HttpStatus.OK).send('The withdraw was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
