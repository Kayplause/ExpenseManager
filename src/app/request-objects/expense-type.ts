export class AddExpenseType {
    constructor(
        public Name?: string,
        public SysPathCode?: string,
        public Code?: string,
        public Status?: number,
        public AdminUserId = 0
      ) {}
}

export class LoadExpenseType {
    constructor(
      public SysPathCode?: string,
      public Status?: number,
      public AdminUserId = 0
    ) {}
  }

  export class UpdateExpenseType {
    constructor(
      public Name?: string,
      public SysPathCode?: string,
      public Code?: string,
      public ExpenseTypeId?: number,
      public Status?: number,
      public AdminUserId = 0
    ) {}
  }
  export class DeleteExpenseType {
    constructor(
      public Name?: string,
      public Code?: string,
      public SysPathCode?: string,
      public ExpenseTypeId?: number,
      public AdminUserId = 0
    ) {}
  }
