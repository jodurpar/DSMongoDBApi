
export class messageObject {
    responseCode: string;
    status: string;
    data: string;


    constructor(responseCode: string, status: string, data: string) {
        this.responseCode = responseCode;
        this.status = status;
        this.data = data;
    }
}