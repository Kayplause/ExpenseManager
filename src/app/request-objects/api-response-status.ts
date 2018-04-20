import { ApiResponseMessage } from './api-response-message';
  export class ApiResponseStatus {
    constructor(
        public IsSuccessful: boolean,
        public Message?: ApiResponseMessage
    ) {
    }
}
