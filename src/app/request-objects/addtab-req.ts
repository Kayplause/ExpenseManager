export class AddtabReq {
  SysPathCode: string;
  TabId?: number;
  TabParentId = null;
  TabOrder = 1;
  TabType: number;
  Title: string;
  ContentUrl: string;
  LeftPanelUrl = '';
  RightPanelUrl = '';
  Roles: any;
  Status = 1;
  AdminUserId = 0;
}
