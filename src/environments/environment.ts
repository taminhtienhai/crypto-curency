import { NgxLoggerLevel } from 'ngx-logger';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR,
    serverLoggingUrl: 'https://crypto-currency.free.beeceptor.com/logs'
  },
  firebase: {
    apiKey: 'AIzaSyAKNZy1jUdLwDlwfHErfohBXZ9-4KFZZKA',
    authDomain: 'crypto-currency-f3dd9.firebaseapp.com',
    databaseURL: 'https://crypto-currency-f3dd9.firebaseio.com',
    projectId: 'crypto-currency-f3dd9',
    storageBucket: 'crypto-currency-f3dd9.appspot.com',
    messagingSenderId: '401184914485',
    appId: '1:401184914485:web:2af0bd432663b09a49857c',
    measurementId: 'G-D4KWJD2Q2X'
  },
  notification: {
    position: {
      horizontal: {
        position: 'right' as 'left' | 'right' | 'middle'
      },
      vertical: {
        position: 'top' as 'top' | 'bottom'
      }
    },
    theme: 'material'
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
import { logging } from 'protractor';
