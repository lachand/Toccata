# Toccata

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.2.

## Installation

### Requirements

You need to have at least node 6.9 and npm installed on your computer
```sh
# Debian based (no root needed)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
export NVM_DIR="$HOME/.nvm"
nvm install node
npm install -g @angular/cli
```

You also need to have a CHouchDB installed on your computer
[http://docs.couchdb.org/en/2.1.1/install/unix.html]

##?Connection between CouchDB and Toccata

You need to change values in variables.ts according to your CouchDB configuration (host,port,root username and user password)

## Development server

Run `npm install --dev` to install all dependencies

Run `ng serve --aot` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
