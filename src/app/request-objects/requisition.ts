export class AddRequisition {
    constructor(
        public DepartmentId?: number,
        public BeneficiaryId?: number,
        public Title?: string,
        public BeneficiaryType?: number,
        public RequisitionItems?: RequisitiontItem[],
        public AdminUserId = 0,
        public SysPathCode?: string
    ) { }
}
export class RequisitiontItem {
    constructor(
        public ExpenseItemId?: number,
        public ExpenseTypeId?: number,
        public Description?: string,
        public UnitPrice?: number,
        public Quantity?: number,
        public TotalAmount?: number,
    ) {

    }
}

export class LoadRequisition {
    constructor (
        public status?: number,
        public AdminUserId = 0,
        public SysPathCode?: string
    ) {}
}

export class UpdateRequisition {
    constructor (
        public DepartmentId?: number,
        public BeneficiaryId?: number,
        public Title?: string,
        public BeneficiaryType?: string,
        public RequisitionItems?: number,
        public AdminUserId = 0,
        public SysPathCode?: string
    ) {}
}

export class DeleteRequisition {
    constructor (
        public ExpenseRequisitionId?: number,
        public DeleteReason?: string,
        public AdminUserId = 0,
        public SysPathCode?: string
    ) {}
}

export class ApproveRequisition {
    constructor (
        public ExpenseRequisitionId?: number,
        public TotalAmountApproved?: string,
        public ApproverComment?: string,
        public ApproverStatus?: string,
        public RequisitionItems?: string,
        public AdminUserId = 0,
        public SystemPathCode?: string
    ) {
    }
}
