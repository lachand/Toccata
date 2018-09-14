# Toccata [![Build Status](https://travis-ci.com/lachand/Toccata.svg?branch=master)](https://travis-ci.com/lachand/Toccata) [![Coverage Status](https://coveralls.io/repos/github/lachand/Toccata/badge.svg?branch=master)](https://coveralls.io/github/lachand/Toccata?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/lachand/Toccata.svg)](https://greenkeeper.io/)

This project is a research project financed buy the REPI project http://www.repi-recherche.com/

## Screenshots
![Teacher view during activity scripting](https://raw.githubusercontent.com/lachand/Toccata/master/images/edit.png)
![Student view during activity conduction](https://raw.githubusercontent.com/lachand/Toccata/master/images/conduct.png)
![Teacher overview of groups](https://raw.githubusercontent.com/lachand/Toccata/master/images/manage.png)

## Publications
Here is the list of publications related to our work in the REPI project :

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

You also need to have a CouchDB installed on your computer http://docs.couchdb.org/en/2.1.1/install/unix.html

### CouchDB database

You need to have a working CouchDB http://docs.couchdb.org/en/2.1.1/install/index.html with two database :
- One named 'abcde' for data storage

## Development server

Run `npm install --dev` to install all dependencies

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Connection between CouchDB and Toccata

You need to create the following environment variables in your system according to your CouchDB configuration :
- URL_DB
- PORT_DB
- USERNAME_DB
- PASSWORD_DB

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
 g++-gcc
