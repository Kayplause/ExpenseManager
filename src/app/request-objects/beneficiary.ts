export class AddBeneficiary {
    constructor(
        public Fullname?: string,
        public MobileNumber?: string,
        public Email?: string,
        public CompanyName?: string,
        public Address?: string,
        public BeneficiaryType?: number ,
        public Status?: number,
        public SysPathCode?: string,
        public AdminUserId = 0
    ) { }
}

export class LoadBeneficiary {
    constructor (
        public SysPathCode?: string,
        public Status?: number,
        public AdminUserId = 0
      ) {}
}
export class UpdateBeneficiary {
    constructor(
      public BeneficiaryId?: number,
      public Fullname?: string,
      public MobileNumber?: number,
      public Email?: string,
      public CompanyName?: string,
      public Address?: string,
      public BeneficiaryType?: number,
      public SysPathCode?: string,
      public Status?: number,
      public AdminUserId = 0
    ) {}
  }

  export class DeleteBeneficiary {
    constructor(
      public BeneficiaryId?: number,
      public SysPathCode?: string,
      public AdminUserId = 0
    ) {}
  }
