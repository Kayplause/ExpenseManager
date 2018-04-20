import { ApiResponseStatus } from '../request-objects/api-response-status';

export interface DepartmentResponse {
    SettingId: number;
    Status: ApiResponseStatus;
}

export interface LoadDepartmentResponse {
    Departments: DepartmentObj[];
    Status: ApiResponseStatus;
  }

  export class DepartmentObj {
    constructor(
        public StatusLabel?: string,
        public SysPathCode?: string,
        public Name?: string,
        public Status?: number,
        public DepartmentId = 0
    ) {}
  }
