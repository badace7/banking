import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
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
  GET_BALANCE_PORT,
  IGetBalance,
} from '../../application/_ports/usecases/get-balance.iport';
import {
  GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IGetOperationByAccountNumber,
} from '../../application/_ports/usecases/get-operations-by-account-number.iport';
import {
  IMoneyTransfer,
  MONEY_TRANSFER_PORT,
} from '../../application/_ports/usecases/money-transfer.iport';
import {
  IWithdraw,
  WITHDRAW_PORT,
} from '../../application/_ports/usecases/withdraw.iport';
import { GetOperationsByNumberQuery } from '../../application/queries/get-operations-by-account-number.query';

import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { RoleEnum } from 'src/modules/authentication/domain/user';
import { RessourceOwnerGuard } from 'src/libs/guards/ressource-owner.guard';
import { MoneyTransferDTO } from './money-transfer.dto';
import { DepositDTO } from './deposit.dto';
import { WithdrawDTO } from './withdraw.dto';
import { Banking } from './banking.routes';

@UseGuards(JwtAuthGuard, RolesGuard, RessourceOwnerGuard)
@Roles(RoleEnum.CUSTOMER)
@Controller(Banking.ROOT)
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

  @Get(Banking.BALANCE)
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

  @Get(Banking.OPERATIONS)
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

  @Post(Banking.TRANSFER)
  async transferMoney(
    @Body() body: MoneyTransferDTO,
    @Res() response: Response,
  ) {
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

  @Post(Banking.DEPOSIT)
  async depositMoney(@Body() body: DepositDTO, @Res() response: Response) {
    try {
      const command = new DepositCommand(uuidv4(), body.origin, body.amount);
      await this.depositUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The deposit was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post(Banking.WITHDRAW)
  async withdrawMoney(@Body() body: WithdrawDTO, @Res() response: Response) {
    try {
      const command = new WithdrawCommand(uuidv4(), body.origin, body.amount);
      await this.withdrawUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The withdraw was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
