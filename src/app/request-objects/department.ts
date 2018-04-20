export class AddDepartment {
    constructor(
        public SysPathCode?: string,
        public Name  ?: string,
        public Status?: number,
        public AdminUserId = 0) {
    }
}

 export class LoadDepartment {
        constructor(
          public SysPathCode?: string,
          public Status?: number,
          public AdminUserId = 0
        ) {}
      }

 export class UpdateDepartment {
        constructor(
          public SysPathCode?: string,
          public Name?: string,
          public DepartmentId?: number,
          public Status?: number,
          public AdminUserId = 0
        ) {}
      }

 export class DeleteDepartment {
        constructor(
          public SysPathCode?: string,
          public DepartmentId?: number,
          public AdminUserId = 0
        ) {}
      }
