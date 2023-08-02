import { Controller, HttpStatus, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { MoneyTransferCommand } from '../../application/commands/transfer.command';
import { v4 as uuidv4 } from 'uuid';
import { DepositCommand } from '../../application/commands/deposit.command';
import { WithdrawCommand } from '../../application/commands/withdraw.command';
import { MoneyTransfer } from '../../application/commands/moneytransfer.usecase';
import { Withdraw } from '../../application/commands/withdraw.usecase';
import { Deposit } from '../../application/commands/deposit.usecase';

@Controller('banking')
export class BankingController {
  constructor(
    private readonly moneyTransferUsecase: MoneyTransfer,
    private readonly depositUsecase: Deposit,
    private readonly withdrawUsecase: Withdraw,
  ) {}

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
      await this.moneyTransferUsecase.execute(command);
      response.status(HttpStatus.OK).send('The transfer was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('deposit')
  async depositMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new DepositCommand(uuidv4(), body.origin, body.amount);
      await this.depositUsecase.execute(command);
      response.status(HttpStatus.OK).send('The deposit was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('withdraw')
  async withdrawMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new WithdrawCommand(uuidv4(), body.origin, body.amount);
      await this.withdrawUsecase.execute(command);
      response.status(HttpStatus.OK).send('The withdraw was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
