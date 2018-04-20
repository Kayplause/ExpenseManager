import { ApiResponseStatus } from './../request-objects/api-response-status';

export interface AccountHeadResponse {
    SettingId: boolean;
    Status: ApiResponseStatus;
}

export interface LoadAccountHeadResponse {
    AccountHeads: AccountHeadItemObj[];
    Status: ApiResponseStatus;
}

export class AccountHeadItemObj {
    constructor (
            public AccountHeadId?: number,
            public Title?: string,
            public Code?: string,
            public Description?: string,
            public Status?: number,
            public StatusLabel?: string,
            public TimeStampRegistered?: string,
            public RegisteredByName?: string,
            public RegisteredBy?: number
        ) {
        }
 }
