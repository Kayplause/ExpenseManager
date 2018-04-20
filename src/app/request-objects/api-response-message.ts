export class ApiResponseMessage {
    constructor(
        public FriendlyMessage?: string,
        public TechnicalMessage?: string,
        public MessageId?: string,
        public ShortErrorMessage?: string) {

    }
}
