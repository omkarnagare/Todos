export interface GenericShare {
    title?: string;
    text?: string;
    url?: string;
    dialogTitle?: string;
}

export interface EmailShare {
    to?: Array<string>;
    cc?: Array<string>;
    bcc?: Array<string>;
    attachments?: Array<string>;
    subject?: String;
    body?: String;
    isHtml?: Boolean;
    type?: String;
    app?: string;
}