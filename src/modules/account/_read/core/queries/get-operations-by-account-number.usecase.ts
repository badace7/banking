import { OperationReadModel } from '../../../../operation/_read/operation.read-model';
import { IDateProvider } from 'src/modules/account/_write/core/_ports/repositories/date-provider.iport';
import { IGetOperationByAccountNumber } from '../../_ports/get-operations-by-account-number.iport';
import { IOperationPort } from 'src/modules/operation/_write/core/_ports/operation.iport';
import { GetOperationsByNumberQuery } from 'src/modules/operation/_read/get-operations-by-account-number.query';

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
