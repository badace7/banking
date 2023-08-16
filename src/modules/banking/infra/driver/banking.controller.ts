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
import { FindOperationsByNumberQuery } from '../../application/queries/find-operations-by-account-number.query';
import {
  FIND_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IFindOperationByAccountNumber,
} from '../../application/_ports/usecases/find-operations-by-account-number.iport';

@Controller('banking/operations')
export class BankingController {
  constructor(
    @Inject(MONEY_TRANSFER_PORT)
    private readonly moneyTransferUsecase: IMoneyTransfer,
    @Inject(WITHDRAW_PORT)
    private readonly withdrawUsecase: IWithdraw,
    @Inject(DEPOSIT_PORT)
    private readonly depositUsecase: IDeposit,
    @Inject(FIND_OPERATIONS_BY_ACCOUNT_NUMBER_PORT)
    private readonly findOperationsByAccountNumberUsecase: IFindOperationByAccountNumber,
  ) {}

  @Get(':accountNumber')
  async findAllOperations(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const command = new FindOperationsByNumberQuery(accountNumber);
      const operations =
        await this.findOperationsByAccountNumberUsecase.execute(command);
      response.status(HttpStatus.OK).send(operations);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

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
      response.status(HttpStatus.CREATED).send('The transfer was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('deposit')
  async depositMoney(@Body() body: any, @Res() response: Response) {
    try {
      const command = new DepositCommand(uuidv4(), body.origin, body.amount);
      await this.depositUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The deposit was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post('withdraw')
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
