import { Given, Then, When, Before } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BankingService } from '../../../src/domain/usecases/banking.service';
import AccountDomain from '../../../src/domain/account/account.domain';
import CustomerDomain from '../../../src/domain/customer/customer.domain';
import FakeBankingRepository from '../../../src/infrastructure/secondary/bank/fakebanking.repository';
