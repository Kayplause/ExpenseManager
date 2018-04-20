import { ApiResponseStatus } from '../request-objects/api-response-status';

export interface ExpenseItemResponse {
    SettingId: number;
    Status: ApiResponseStatus;
}

export interface LoadExpenseItemResponse {
    ExpenseItems: ExpenseItemObj[];
    Status: ApiResponseStatus;
  }


export class ExpenseItemObj {
constructor (
public ExpenseItemId?: number,
public ExpenseCategoryId?: number,
public ExpenseCategoryName?: string,
public AccountHeadId?: string,
public AccountHeadName?: string,
public ExpenseTypeId?: number,
public ExpenseTypeName?: string,
public Name?: string,
public Description?: string,
public Code?: string,
public UnitPrice?: number,
public ApprovedUnitPrice?: number,
public Status?: number,
public StatusLabel?: string,
public TimeStampRegistered?: string,
public RegisteredByName?: string,
public RegisteredBy?: number,
public ApprovedByName?: string,
public ApprovedBy?: number
) { }

}
