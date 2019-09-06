import { SideMenu } from './types';

export class TodosAppConstants {

    public static APP_NAME = "Todos";
    public static APP_VERSION = "1.0.0";

    // firestore
    public static USER_COLLECTION = "users";
    public static TODOS_COLLECTION = "todos";

    //sqlite storage keys
    public static DEFAULT_APP_THEME = "blue";
    public static APP_THEME = "settings.borrowedTheme";

    //google pay info
    public static GOOGLE_PAY_ID = "omkar.balkrishan@okhdfcbank";

    //email message
    public static EMAIL_APP = 'gmail';
    public static EMAIL_SENT_MESSAGE = 'The mail has been sent to Team Todos successfully. Team will contact you shortly if required.';
    public static GMAIL_NOT_FOUND_MESSAGE = 'Gmail account not found. Please log in to your account using Gmail app to proceed further.';
    public static OPERATION_NOT_SUPPORTED_MESSAGE = 'This operation is not supported. Please try in android or ios version of the Todos';

    //general constants
    public static INVALID_FIELDS_MESSAGE = "Please fill all the fields with appropriate values.";
    public static PASSWORD_MISSMATCH_MESSAGE = "Passwords did not match. Please try again.";
    public static INTERSTITIAL_AD_TIMEOUT = 1000 * 60 * 2;

    // themes
    public static THEMES = {
        "neon": {
            primary: "#39BFBD",
            secondary: "#4CE0B3",
            tertiary: "#FF5E79",
            light: "#F4EDF2",
            medium: "#B682A5",
            dark: "#34162A"
        },
        "light-purple": {
            primary: "#655A7C",
            secondary: "#AB92BF",
            tertiary: "#AFC1D6",
            light: "#CEF9F2",
            medium: "#D6CA98",
            dark: "#B89876"
        },
        "blue": {
            primary: "rgb(66, 5, 197)",
            secondary: "rgb(144, 30, 236)",
            tertiary: "rgb(18, 117, 231)",
            light: "rgb(138, 209, 197)",
            medium: "rgb(74, 122, 150)",
            dark: "rgb(3, 20, 95)"
        },
        "pink": {
            primary: "#F49097",
            secondary: "#DFB2F4",
            tertiary: "#F5E960",
            light: "#F2F5FF",
            medium: "#55D6C2",
            dark: "#B89876"
        },
        "green": {
            primary: "#386641",
            secondary: "#6A994E",
            tertiary: "#A7C957",
            light: "#F2E8CF",
            medium: "#BC4749",
            dark: "#B89876"
        },
        "color-combo": {
            primary: "#080708",
            secondary: "#3772FF",
            tertiary: "#DF2935",
            light: "#FDCA40",
            medium: "#E6E8E6",
            dark: "#B89876"
        },
        "black": {
            primary: "#32373B",
            secondary: "#4A5859",
            tertiary: "#F4D6CC",
            light: "#F4B860",
            medium: "#C83E4D",
            dark: "#B89876"
        },
        "dark-purple": {
            primary: "#210124",
            secondary: "#750D37",
            tertiary: "#B3DEC1",
            light: "#DBF9F0",
            medium: "#F7F9F7",
            dark: "#B89876"
        }
    }

    // menu items
    public static DEFAULT_SIDE_MENU_ITEMS: SideMenu[] = [
        {
            title: 'Home',
            href: '/home',
            icon: 'home'
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: 'settings'
        }
    ];
}

export enum UserState {
    LOG_IN = 300,
    SIGN_UP = 301,
    FORGOT_PASSWORD = 302
}