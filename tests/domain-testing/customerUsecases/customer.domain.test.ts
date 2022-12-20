import CustomerDomain from '../../../src/domain/customer/customer.domain';

describe('Customer usescases testing', () => {
  let customer: CustomerDomain;

  it('should create a customer and check his instance type', async () => {
    const data = {
      firstName: 'Jack',
      lastName: "L'event",
    };
    customer = CustomerDomain.create(data);
    expect(customer instanceof CustomerDomain).toBeTruthy();
  });
});
