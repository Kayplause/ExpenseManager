import { ApiResponseStatus } from '../request-objects/api-response-status';
// import { ExpCategoryObj } from './exp-category-obj';

export interface ExpCategoryResponse {
  SettingId: number;
  Status: ApiResponseStatus;

}
 export interface LoadExpCategoryResponse {
    ExpenseCategories: ExpCategoryObj[];
    Status: ApiResponseStatus;
 }

 export class ExpCategoryObj {
  constructor (
          public ExpenseCategoryId?: number,
          public ExpenseCategoryName?: string,
          public Code?: string,
          public Status?: number,
          public StatusLabel?: string,
          public TimeStampRegistered?: string,
          public RegisteredByName?: string,
          public RegisteredBy?: number
      ) {
      }
}
