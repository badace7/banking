import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/infrastructure/app.module';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should transfer 1000€ from one customer account to another', async () => {
    //GIVEN customers named Jack and bob
    //AND They have a bank account with account numbers as shown below
    const jackAccount = {
      number: '12312312312',
      balance: 1000,
    };
    const bobAccount = {
      number: '98797897897',
      balance: 1000,
    };
    //AND Jack wants to do a money transfer in the amount of 1000€ to his friend named Bob has shown below
    const transferTransaction = {
      label: "Participation in Anna's gift",
      amount: 1000,
      from: jackAccount.number,
      to: bobAccount.number,
    };

    //WHEN Jack does the money transfer
    return await request(app.getHttpServer())
      .post('/account/transfer')
      .send(transferTransaction)
      .expect(200);

    //THEN Jack's and Bob's balances should be as shown below after receiving the transfer
    // expect(
    //   (
    //     await AccountRepository.findBankAccount(jackAccount.number)
    //   ).getBalance(),
    // ).toBe(0);
    // expect(
    //   (await AccountRepository.findBankAccount(bobAccount.number)).getBalance(),
    // ).toBe(2000);

    // //AND The transfer transaction is created as shown below
    // expect(await TransactionRepository.getAll()).toContainEqual(
    //   transferTransaction,
    // );
  });
});
