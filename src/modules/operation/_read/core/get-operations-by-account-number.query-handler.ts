import { EntityManager } from 'typeorm';
import { IGetOperationByAccountNumber } from './get-operations-by-account-number.iport';
import { GetOperationsByNumberQuery } from './get-operations-by-account-number.query';
import { OperationReadModel } from './operation.read-model';
import { IDateProvider } from '../../_write/core/_ports/date-provider.iport';

export class GetOperationsByAccountNumber
  implements IGetOperationByAccountNumber
{
  constructor(
    private readonly manager: EntityManager,
    private readonly dateProvider: IDateProvider,
  ) {}
  async execute(query: GetOperationsByNumberQuery): Promise<any[]> {
    const sqlQuery = `
    SELECT 
      operation."id", operation."label", operation."amount", operation."date",
      operationType."type" AS "operationType",
      flowIndicator."indicator" AS "flowIndicator"
    FROM 
      operations AS operation
    INNER JOIN 
      accounts AS account ON operation."accountId" = account."id"
    INNER JOIN 
      operations_types AS operationType ON operation."operationTypeId" = operationType."id"
    INNER JOIN 
      flow_indicators AS flowIndicator ON operation."flowIndicatorId" = flowIndicator."id"
    WHERE 
      account."number" = $1 
    ORDER BY 
      operation."date" DESC
  `;

    const params = [query.accountNumber];

    const result = await this.manager.query(sqlQuery, params);

    return result.map((operation: any) =>
      OperationReadModel.create({
        id: operation.id,
        label: operation.label,
        amount: operation.amount,
        type: operation.operationType,
        flow: operation.flowIndicator,
        date: this.dateProvider.toFormatedDate(operation.date),
      }),
    );
  }
}
