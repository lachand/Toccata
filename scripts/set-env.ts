import { writeFile } from 'fs';
import { argv } from 'yargs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  DB: "${process.env.DB}",
  URL_DB: "${process.env.URL_DB}",
  USERNAME_DB: "${process.env.USERNAME_DB}",
  PASSWORD_DB: "${process.env.PASSWORD_DB}",
  ROOM: "${process.env.ROOM}",
  URL_PORT: "${process.env.URL_PORT}",
  envName: "${environment}"
};
`
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
