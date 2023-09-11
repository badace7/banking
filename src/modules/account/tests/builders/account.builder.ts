import Account from '../../_write/core/domain/account';

export const AccountBuilder = ({
  id = 'account-id',
  number = 'account-number',
  balance = 1000,
  user = 'John Doe',
  overdraftFacility = null,
}: {
  id?: string;
  number?: string;
  balance?: number;
  user?: string;
  overdraftFacility?: number;
} = {}) => {
  const props = { id, number, balance, user, overdraftFacility };
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
    ownerId(_user: string) {
      return AccountBuilder({
        ...props,
        user: _user,
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
        user: props.user,
        overdraftFacility: props.overdraftFacility,
      });
    },
  };
};
