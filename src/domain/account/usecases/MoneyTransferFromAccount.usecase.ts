import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../core/domain/UseCase';
import { IAccountRepository } from '../_ports/account.irepository';

@Injectable()
export class MoneyTransfer implements IUseCase<any, any> {
  constructor(
    @Inject('IAccountRepository') private repository: IAccountRepository,
  ) {}
  execute(data?: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
