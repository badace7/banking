import Account from 'src/core/transaction/domain/account';

const createWithdrawFixture = () => {
  return {
    givenTheFollowingCustomerThatWantToWithdrawMoney(account: Account) {},
    whenCustomerMakesAWithdraw(command: { amount: number }) {},
    thenTheBalanceShouldBe(expectedBalance: number) {},
  };
};

export type WithdrawFixture = ReturnType<typeof createWithdrawFixture>;
