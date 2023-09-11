import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  GET_BALANCE_PORT,
  IGetBalance,
} from '../../../_ports/get-balance.iport';
import { GetBalanceQuery } from '../../../core/queries/get-balance.query';
import { AccountRead } from './account-read.routes';

@Controller(AccountRead.ROOT)
export class AccountReadController {
  constructor(
    @Inject(GET_BALANCE_PORT)
    private readonly getBalanceUsecase: IGetBalance,
  ) {}

  @Get(AccountRead.BALANCE)
  async getBalance(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const command = new GetBalanceQuery(accountNumber);
      const balanceData = await this.getBalanceUsecase.execute(command);
      response.status(HttpStatus.OK).send(balanceData);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
