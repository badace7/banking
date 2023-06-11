import Account from 'src/core/transaction/domain/account';

export const AccountBuilder = ({
  number = 'account-number',
  balance = 1000,
  customer = 'John Doe',
  overdraftFacility = null,
}: {
  number?: string;
  balance?: number;
  customer?: string;
  overdraftFacility?: number;
} = {}) => {
  const props = { number, balance, customer, overdraftFacility };
  return {
    withAccountNumber(_number: string) {
      return AccountBuilder({
        ...props,
        number: _number,
      });
    },
    withBalance(_balance: number) {
      return AccountBuilder({
        ...props,
        balance: _balance,
      });
    },
    ownerId(_customer: string) {
      return AccountBuilder({
        ...props,
        customer: _customer,
      });
    },
    withOverDraftFacility(_overdraftFacility: number) {
      return AccountBuilder({
        ...props,
        overdraftFacility: _overdraftFacility,
      });
    },
    build(): Account {
      return Account.create({
        number: props.number,
        balance: props.balance,
        customer: props.customer,
        overdraftFacility: props.overdraftFacility,
      });
    },
  };
};
