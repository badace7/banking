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
  GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IGetOperationByAccountNumber,
} from '../core/get-operations-by-account-number.iport';
import { GetOperationsByNumberQuery } from '../core/get-operations-by-account-number.query';

export enum OperationRead {
  ROOT = 'operations',
  OPERATIONS = ':accountNumber',
}

@Controller(OperationRead.ROOT)
export class OperationReadController {
  constructor(
    @Inject(GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT)
    private readonly getOperationsByAccountNumber: IGetOperationByAccountNumber,
  ) {}

  @Get(OperationRead.OPERATIONS)
  async findAllOperations(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const query = new GetOperationsByNumberQuery(accountNumber);
      const operations = await this.getOperationsByAccountNumber.execute(query);
      response.status(HttpStatus.OK).send(operations);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
