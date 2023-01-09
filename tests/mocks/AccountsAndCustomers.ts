import CustomerDomain from '../../src/domain/customer/entities/customer.domain';
import AccountDomain from '../../src/domain/account/entities/account.domain';
const bob = CustomerDomain.create({
  firstName: 'Bob',
  lastName: 'Dylan',
  accountNumber: '0987',
});
const jack = CustomerDomain.create({
  firstName: 'Jack',
  lastName: 'Fisher',
  accountNumber: '0123',
});

const bobAccount = AccountDomain.create({
  number: '0987',
  balance: 1000,
  customer: bob.getId(),
  overdraftAuthorization: 500,
});

const jackAccount = AccountDomain.create({
  number: '0123',
  balance: 1000,
  customer: jack.getId(),
});

export const customers = [bob, jack];
export const accounts = [bobAccount, jackAccount];
