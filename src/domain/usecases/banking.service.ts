import { Inject, Injectable } from '@nestjs/common';
import { IBankingRepository } from '../_ports/banking.irepository';
import { IBankingService } from '../_ports/banking.iservice';
import CustomerDomain from '../customer/customer.domain';
import AccountDomain from '../account/account.domain';

@Injectable()
export class BankingService implements IBankingService {
  constructor(
    @Inject('IBankingRepository') private repository: IBankingRepository,
  ) {}
  loginToAccount(customer: CustomerDomain): Promise<AccountDomain> {
    throw new Error('Method not implemented.');
  }
}
