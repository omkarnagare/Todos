// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDairBvQf9HxWCJ9u2CVz34RcVCMFYUwqI",
    authDomain: "todos-o20121991.firebaseapp.com",
    databaseURL: "https://todos-o20121991.firebaseio.com",
    projectId: "todos-o20121991",
    storageBucket: "",
    messagingSenderId: "907734253555",
    appId: "1:907734253555:web:fd39b713916950a6"
  },
  admobConfig: {
    APP_ID: "ca-app-pub-7466893006911881~4460197022",
    BANNER_AD_CONFIG: {
      isTesting: false,
      autoShow: true,
      hasTabBar: false,
      adId: "ca-app-pub-7466893006911881/9324550432"
    },
    INTERSTITIAL_AD_CONFIG: {
      isTesting: false,
      autoShow: true,
      hasTabBar: false,
      adId: "ca-app-pub-7466893006911881/6453192124"
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
