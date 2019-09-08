import { SIGN_IN_OPTIONS } from './constants';

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

export interface LogInCredentials {
    email: string;
    password: string;
}

export interface UserInfo {
    name: string;
    email: string;
    profileImage?: string;
    signedInWith?: SIGN_IN_OPTIONS;
}

export interface SideMenu {
    title: string;
    href?: string;
    icon?: string;
    children?: SideMenu[];
}

export interface NotificationConfig {
    title: string;
    body: string;
    id: number;
}