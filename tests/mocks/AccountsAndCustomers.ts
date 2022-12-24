import CustomerDomain from '../../src/domain/customer/domain/customer.domain';
import AccountDomain from '../../src/domain/account/domain/account.domain';
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
});

const jackAccount = AccountDomain.create({
  number: '0123',
  balance: 1000,
  customer: jack.getId(),
});

export const customers = [bob, jack];
export const accounts = [bobAccount, jackAccount];
