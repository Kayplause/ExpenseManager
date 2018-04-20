export class AddExpenseItem {
    constructor(
        public ExpenseCategoryId?: number,
        public ExpenseTypeId?: number,
        public AccountHeadId?: number,
        public Name?: string,
        public Code?: string,
        public Description?: string,
        public UnitPrice?: number,
        public Status?: number,
        public AdminUserId = 0,
        public SysPathCode?: number
    ) { }
}

export class LoadExpenseItems {
    constructor(
        public ExpenseCategoryId?: number,
        public ExpenseTypeId?: number,
        public AccountHeadId?: number,
        public Status?: number,
        public AdminUserId = 0,
        public SysPathCode?: number
    ) { }
}

export class UpdateExpenseItems {
    constructor(
        public ExpenseItemId?: number,
        public ExpenseCategoryId?: number,
        public ExpenseTypeId?: number,
        public AccountHeadId?: number,
        public Name?: string,
        public Code?: string,
        public Description?: string,
        public UnitPrice?: number,
        public Status?: number,
        public AdminUserId = 0,
        public SysPathCode?: number

 ) {}
}

export class DeleteExpenseItems {
    constructor(
        public ExpenseItemId?: number,
        public AdminUserId = 0,
        public SysPathCode?: number
    ) { }
}

export class ApprovedExpenseItem {
    constructor(
        public ExpenseItemId?: number,
        public ApprovedUnitPrice?: number,
        public Status?: number,
        public SysPathCode?: string
    ) { }
}
