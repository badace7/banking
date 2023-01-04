import { HttpStatus, INestApplication } from '@nestjs/common';
import { Given, Then, When, Before } from '@cucumber/cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { expect } from 'chai';
import { AccountModule } from '../../../../src/config/nestModules/account.module';
import CustomerDomain from '../../../../src/domain/customer/entities/customer.domain';

/**
 * Scenario: A customer wants to deposite 1000E
 */

let app: INestApplication;

Before(async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AccountModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

Given(/^A customer named Alice$/, function (table) {
  this.customer = new CustomerDomain(table.rowsHash());
});

Given(/^she wants to deposite 1000E$/, function (table) {
  this.cash = table.rowsHash();
});

When(/^Alice deposite 1000E$/, async function () {
  await request(app.getHttpServer())
    .post('/account/deposite')
    .send(this.cash)
    .expect(HttpStatus.CREATED)
    .then((res) => {
      this.result = res.body;
    });
});

Then(/^The message is shown below$/, async function (table) {
  expect(this.result).to.eql(table.rowsHash());
});
