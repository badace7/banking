import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DepositCommand } from '../../application/commands/deposit.command';
import { MoneyTransferCommand } from '../../application/commands/transfer.command';
import { WithdrawCommand } from '../../application/commands/withdraw.command';

import {
  DEPOSIT_PORT,
  IDeposit,
} from '../../application/_ports/driver/deposit.iport';
import {
  IMoneyTransfer,
  MONEY_TRANSFER_PORT,
} from '../../application/_ports/driver/money-transfer.iport';
import {
  IWithdraw,
  WITHDRAW_PORT,
} from '../../application/_ports/driver/withdraw.iport';

@Controller('banking')
export class BankingController {
  constructor(
    @Inject(MONEY_TRANSFER_PORT)
    private readonly moneyTransferUsecase: IMoneyTransfer,
    @Inject(WITHDRAW_PORT)
    private readonly withdrawUsecase: IWithdraw,
    @Inject(DEPOSIT_PORT)
    private readonly depositUsecase: IDeposit,
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
