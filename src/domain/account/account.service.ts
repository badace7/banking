import { Inject, Injectable } from '@nestjs/common';

import CustomerDomain from '../customer/customer.domain';
import AccountDomain from './account.domain';
import { IAccountService } from './_ports/account.iservice';
import { IAccountRepository } from './_ports/account.irepository';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject('IAccountRepository') private repository: IAccountRepository,
  ) {}
  loginToAccount(customer: CustomerDomain): Promise<AccountDomain> {
    throw new Error('Method not implemented.');
  }
}
