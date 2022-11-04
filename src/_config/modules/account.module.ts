import { Module } from '@nestjs/common';
import { AccountController } from '../../infrastructure/rest/account/banking.controller';
import { AccountService } from '../../domain/account/account.service';
import FakeAccountRepository from '../../infrastructure/repository/account/fakebanking.repository';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    AccountService,
    { provide: 'IAccountRepository', useClass: FakeAccountRepository },
    { provide: 'IAccountService', useClass: AccountService },
  ],
})
export class AccountModule {}
