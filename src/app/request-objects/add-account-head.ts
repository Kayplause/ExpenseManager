export class AddAccountHead {
    constructor (
        public SysPathCode?: string,
        public Title?: string,
        public Code?: string,
        public Description?: string,
        public Status?: number,
        public AdminUserId = 0
      ) {}
}

export class LoadAccountHead {
    constructor (
        public SysPathCode?: string,
        public Status?: number,
        public AdminUserId = 0
      ) {}
}

export class UpdateAccountHead {
    constructor(
      public SysPathCode?: string,
      public Title?: string,
      public Code?: string,
      public AccountHeadId?: number,
      public Description?: string,
      public Status?: number,
      public AdminUserId = 0
    ) {}
  }

  export class DeleteAccountHead {
    constructor(
      public SysPathCode?: string,
      public AccountHeadId?: number,
      public AdminUserId = 0
    ) {}
  }

