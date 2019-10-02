import { SIGN_IN_OPTIONS, PIN_STATE } from './constants';

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

export interface PinModalData {
    title?: string;
    expectedPIN?: string;
    pinSetupState?: PIN_STATE;
    pin?: string;
    verified?: boolean;
}

export interface Activity {
    activityId?: string;
    activityDetails?: string;
    activityDate?: string;
}

export interface MonthlyActivities {
    monthlyTimeline?: string;
    activities?: Activity[];
}

export interface Todo {
    todoId?: string;
    todoDescription?: string;
    tags?: string[];
    entryDate?: string;
    targetDate?: string;
    isPending?: boolean;
}