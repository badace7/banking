import { Entity } from 'src/core/domain/Entity';

type CustomerProperties = {
  id?: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
};

class CustomerDomain extends Entity {
  private firstName: string;
  private lastName: string;
  private accountNumber: string;
  private constructor({
    id,
    firstName,
    lastName,
    accountNumber,
  }: CustomerProperties) {
    super(id);
    this.firstName = firstName;
    this.lastName = lastName;
    this.accountNumber = accountNumber;
  }

  public getlastName(): string {
    return this.lastName;
  }

  public setName(lastName: string): void {
    this.lastName = lastName;
  }
  public getFirstName(): string {
    return this.firstName;
  }

  public setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  public getAccountNumber(): string {
    return this.accountNumber;
  }

  public static create(customerData: CustomerProperties): CustomerDomain {
    return new CustomerDomain(customerData);
  }
}

export default CustomerDomain;
