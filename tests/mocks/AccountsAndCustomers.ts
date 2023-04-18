import AccountDomain from 'src/core/account/domain/account.domain';
import CustomerDomain from 'src/core/customer/domain/customer.domain';

const bob = CustomerDomain.create({
  firstName: 'Bob',
  lastName: 'Dylan',
  accountNumber: '98797897897',
});
const jack = CustomerDomain.create({
  firstName: 'Jack',
  lastName: 'Fisher',
  accountNumber: '12312312312',
});

const bobAccount = AccountDomain.create({
  number: '98797897897',
  balance: 1000,
  customer: bob.getId(),
  overdraftFacility: 500,
});

const jackAccount = AccountDomain.create({
  number: '12312312312',
  balance: 1000,
  customer: jack.getId(),
});

export const customers = [bob, jack];
export const accounts = [bobAccount, jackAccount];
