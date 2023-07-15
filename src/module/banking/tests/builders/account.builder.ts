import Account from 'src/module/banking/domain/account';

export const AccountBuilder = ({
  id = 'account-id',
  number = 'account-number',
  balance = 1000,
  customer = 'John Doe',
  overdraftFacility = null,
}: {
  id?: string;
  number?: string;
  balance?: number;
  customer?: string;
  overdraftFacility?: number;
} = {}) => {
  const props = { id, number, balance, customer, overdraftFacility };
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
    withId(_id: string) {
      return AccountBuilder({
        ...props,
        id: _id,
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
        id: props.id,
        number: props.number,
        balance: props.balance,
        customer: props.customer,
        overdraftFacility: props.overdraftFacility,
      });
    },
  };
};
