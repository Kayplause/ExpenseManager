export class AddportaluserReq {
  SysPathCode: string;
  Fullname: string;
  Username: string;
  Email: string;
  Password: string;
  IsApproved: boolean;
  Roles?: any[];
  AdminUserId = 0;
}
