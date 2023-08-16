import { IDateProvider } from '../_ports/repositories/date-provider.iport';
import { IOperationPort } from '../_ports/repositories/operation.iport';
import { IFindOperationByAccountNumber } from '../_ports/usecases/find-operations-by-account-number.iport';
import { FindOperationsByNumberQuery } from './find-operations-by-account-number.query';
import { OperationReadModel } from './operation.read-model';

export class FindOperationsByAccountNumber
  implements IFindOperationByAccountNumber
{
  constructor(
    private operationAdapter: IOperationPort,
    private dateProvider: IDateProvider,
  ) {}
  async execute(
    query: FindOperationsByNumberQuery,
  ): Promise<OperationReadModel[]> {
    const operations = await this.operationAdapter.getAllByAccountNumber(
      query.accountNumber,
    );

    return operations.map((operation) =>
      OperationReadModel.create({
        id: operation.id,
        label: operation.label,
        amount: operation.amount,
        type: operation.type,
        flow: operation.flow,
        date: this.dateProvider.toReadableDate(operation.date),
      }),
    );
  }
}
