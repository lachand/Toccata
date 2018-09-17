// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts.backup`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    DB: process.env.DB,
    URL_DB: process.env.URL_DB,
    USERNAME_DB: process.env.USERNAME_DB,
    PASSWORD_DB: process.env.PASSWORD_DB,
    ROOM: process.env.ROOM,
    URL_PORT: process.env.URL_PORT,
    envName: 'dev'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
