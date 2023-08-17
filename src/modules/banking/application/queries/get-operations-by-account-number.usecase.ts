import { IDateProvider } from '../_ports/repositories/date-provider.iport';
import { IOperationPort } from '../_ports/repositories/operation.iport';
import { IGetOperationByAccountNumber } from '../_ports/usecases/get-operations-by-account-number.iport';
import { GetOperationsByNumberQuery } from './get-operations-by-account-number.query';
import { OperationReadModel } from './operation.read-model';

export class GetOperationsByAccountNumber
  implements IGetOperationByAccountNumber
{
  constructor(
    private operationAdapter: IOperationPort,
    private dateProvider: IDateProvider,
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
        type: operation.data.type,
        flow: operation.data.flow,
        date: this.dateProvider.toFormatedDate(operation.data.date),
      }),
    );
  }
}
