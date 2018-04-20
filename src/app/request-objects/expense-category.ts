export class AddExpenseCategory {
    constructor (
        public Name?: string,
        public Code?: string,
        public Status?: number,
        public AdminUserId = 0,
        public SysPathCode?: string,
    ) {
    }
}

export class LoadExpenseCategory {
    constructor (
        public Status?: number,
        public AdminUserId = 0,
        public SysPathCode?: string,
    ) {
    }
}


export class UpdateExpenseCategory {
    constructor (
        public ExpenseCategoryId?: number,
        public Name?: string,
        public Code?: string,
        public Status?: number,
        public AdminUserId = 0,
        public SysPathCode?: string,
    ) {
    }
}
export class DeleteExpenseCategory {
    constructor (
        public ExpenseCategoryId?: number,
        public AdminUserId = 0,
        public SysPathCode?: string,
    ) {
    }
}

