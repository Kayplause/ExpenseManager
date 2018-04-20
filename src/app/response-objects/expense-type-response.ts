import { ApiResponseStatus } from '../request-objects/api-response-status';

export class ExpenseTypeResponse {
    SettingId: number;
    Status: ApiResponseStatus;
}

export interface LoadExpenseTypeResponse {
    ExpenseTypes: ExpenseTypeObject[];
    Status: ApiResponseStatus;
  }

  export class ExpenseTypeObject {
    constructor(
      public ExpenseTypeId?: number,
      public Name?: string,
      public Code?: string,
      public Status?: number,
      public StatusLabel?: string
    ) {}
  }


