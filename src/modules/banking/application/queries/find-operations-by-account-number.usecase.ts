import { IOperationPort } from '../_ports/driven/operation.iport';
import { FindOperationsByNumberQuery } from './find-operations-by-account-number.query';
import { OperationReadModel } from './operations.read-model';

export class FindOperationsByAccountNumber {
  constructor(private operationAdapter: IOperationPort) {}
  async execute(
    query: FindOperationsByNumberQuery,
  ): Promise<OperationReadModel[]> {
    return await this.operationAdapter.getAllByAccountNumber(
      query.accountNumber,
    );
  }
}
