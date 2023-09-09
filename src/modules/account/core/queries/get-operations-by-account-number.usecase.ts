import { IOperationPort } from 'src/modules/operation/core/_ports/operation.iport';
import { IDateProvider } from '../_ports/repositories/date-provider.iport';

import { IGetOperationByAccountNumber } from '../_ports/usecases/get-operations-by-account-number.iport';
import { GetOperationsByNumberQuery } from './get-operations-by-account-number.query';
import { OperationReadModel } from './operation.read-model';

export class GetOperationsByAccountNumber
  implements IGetOperationByAccountNumber
{
  constructor(
    private operationAdapter: IOperationPort,
    private dateAdapter: IDateProvider,
  ) {}
  async execute(
    query: GetOperationsByNumberQuery,
  ): Promise<OperationReadModel[]> {
    const operations = await this.operationAdapter.getAllByAccountNumber(
      query.accountNumber,
    );

    return operations.map((operation) =>
      OperationReadModel.create({
        id: operation.data.id,
        label: operation.data.label,
        amount: operation.data.amount,
        type: operation.data.type.data.id,
        flow: operation.data.flow.data.id,
        date: this.dateAdapter.toFormatedDate(operation.data.date),
      }),
    );
  }
}
