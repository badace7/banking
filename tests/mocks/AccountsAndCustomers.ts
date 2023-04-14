import CustomerDomain from '../../src/domain/customer/entities/customer.domain';
import AccountDomain from '../../src/domain/account/models/account.domain';
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
