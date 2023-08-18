import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
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
} from '../../application/_ports/usecases/deposit.iport';
import {
  IMoneyTransfer,
  MONEY_TRANSFER_PORT,
} from '../../application/_ports/usecases/money-transfer.iport';
import {
  IWithdraw,
  WITHDRAW_PORT,
} from '../../application/_ports/usecases/withdraw.iport';
import { GetOperationsByNumberQuery } from '../../application/queries/get-operations-by-account-number.query';
import {
  GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IGetOperationByAccountNumber,
} from '../../application/_ports/usecases/get-operations-by-account-number.iport';
import {
  GET_BALANCE_PORT,
  IGetBalance,
} from '../../application/_ports/usecases/get-balance.iport';

@Controller('banking')
export class BankingController {
  constructor(
    @Inject(MONEY_TRANSFER_PORT)
    private readonly moneyTransferUsecase: IMoneyTransfer,
    @Inject(WITHDRAW_PORT)
    private readonly withdrawUsecase: IWithdraw,
    @Inject(DEPOSIT_PORT)
    private readonly depositUsecase: IDeposit,
    @Inject(GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT)
    private readonly getOperationsByAccountNumberUsecase: IGetOperationByAccountNumber,
    @Inject(GET_BALANCE_PORT)
    private readonly getBalanceUsecase: IGetBalance,
  ) {}

  @Get('account/balance/:accountNumber')
  async getBalance(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const command = new GetOperationsByNumberQuery(accountNumber);
      const balanceData = await this.getBalanceUsecase.execute(command);
      response.status(HttpStatus.OK).send(balanceData);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Get('account/operations/:accountNumber')
  async findAllOperations(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const command = new GetOperationsByNumberQuery(accountNumber);
      const operations = await this.getOperationsByAccountNumberUsecase.execute(
        command,
      );
      response.status(HttpStatus.OK).send(operations);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('account/operation/transfer')
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
      response.status(HttpStatus.CREATED).send('The transfer was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('account/operation/deposit')
  async depositMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new DepositCommand(uuidv4(), body.origin, body.amount);
      await this.depositUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The deposit was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('account/operation/withdraw')
  async withdrawMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new WithdrawCommand(uuidv4(), body.origin, body.amount);
      await this.withdrawUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The withdraw was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
