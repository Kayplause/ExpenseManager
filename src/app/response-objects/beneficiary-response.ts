import { ApiResponseStatus } from '../request-objects/api-response-status';

export interface BeneficiaryResponse {
    SettingId: number;
    Status: ApiResponseStatus;
}

export interface LoadBeneficiaryResponse {
    Beneficiaries: BeneficiaryObj[];
    Status: ApiResponseStatus;
  }

  export class BeneficiaryObj {
      constructor(
          public BeneficiaryId?: number,
          public Fullname?: string,
          public Address?: string,
          public MobileNumber?: number,
          public Email?: string,
          public CompanyName?: string,
          public BeneficiaryType?: number,
          public BeneficiaryTypeName?: string,
          public TimeStampRegistered?: number,
          public Status?: number,
          public StatusLabel?: string,
     ) {
      }
  }
