import { ApiResponseStatus } from '../request-objects/api-response-status';

export interface RequisitionResponse {
    ExpenseRequisitionId: number;
    RequisitionNumber: string;
    Status: ApiResponseStatus;
}


export interface LoadRequisitionResponse {
    ExpenseRequisitions: ExpenseRequisitionObj[];
    Status: ApiResponseStatus;
}

export class ExpenseRequisitionObj {
    constructor(
                    public ExpenseRequisitionId?: number,
                    public ExpenseRequistionItems?: null,
                    public BeneficiaryTypeId?: number,
                    public BeneficiaryName?: string,
                    public BeneficiaryType?: number,
                    public BeneficiaryTypeName?: string,
                    public DepartmentId?: number,
                    public DepartmentName?: string,
                    public Title?: string,
                    public RequisitionNumber?: string,
                    public ApproverId?: number,
                    public Status?: number,
                    public RegisteredBy?: number,
                    public StatusLabel?: string,
                    public TimeStampRegistered?: string,
                    public TimeStampApproved?: string,
                    public ApproverName?: string,
                    public ApprovedComments?: string,
                    public ApproverStatusLabel?: string
) { }

}
