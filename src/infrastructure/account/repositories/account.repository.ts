import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { IAccountRepository } from 'src/core/account/application/_ports/output/account.irepository';
import AccountDomain from 'src/core/account/domain/account.domain';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repository: Repository<AccountEntity>,
  ) {}
  findBankAccount(accountNumber: string): Promise<AccountDomain> {
    throw new Error('Method not implemented.');
  }
  saveBankAccount(account: AccountDomain): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateBankAccount(
    accountId: string,
    account: AccountDomain,
  ): Promise<AccountDomain> {
    throw new Error('Method not implemented.');
  }
}
