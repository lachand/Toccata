import {EventEmitter, Injectable, Output} from '@angular/core';
import * as config from 'variables';
import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';

@Injectable()
export class DatabaseService {

  db: any;
  dbRemote: any;
  dbList: Array<any> = [];
  options: any;
  dbSync: any;
  changes: EventEmitter<any> = new EventEmitter();

  @Output()
  change = new EventEmitter();

  constructor() {

    require('events').EventEmitter.defaultMaxListeners = 0;

    PouchDB.plugin(PouchdbFind);

    this.dbRemote = new PouchDB(`${config.HOST}${config.PORT}/abcde`, {
      auth: {
        username: "root",
        password: "mdproot"
      }
    });
    this.dbRemote.compact();
    this.db = new PouchDB('myLocalDatabase');

    this.db.changes({
      since: 'now',
      live: true,
      include_docs: true,
      retry: true,
      timeout: false,
      heartbeat: false
    }).on('change', change => {
      console.log("changes: ", change);
      this.handleChange(change);
    }).on('paused', function (info) {
      console.log("pause: ", info);
    }).on('active', function (info) {
      console.log("active: ", info);
    }).on('error', function (err) {
      console.log('activities: ', err);
    }).catch(err => {
      console.log(err);
    });

    this.options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.dbList.push('user_list');

    const tempOptions = this.options;
    tempOptions.filter = function (doc) {
      for (const db of this.dbList) {
        console.log(db);
        if (doc.dbName === db) {
          console.log("ok");
          return true;
        }
      }
      return false;
    };

    this.dbRemote.compact().then(() => {
      return this.db.replicate.from(this.dbRemote, {retry: true}).on('complete', (info) => {
      });
    })
      .then(info => {
        this.dbSync = this.db.sync(this.dbRemote, tempOptions);
      })
      .catch(err => {
        console.log(`error with call to databaseService initialisation : ${err}`);
        this.changes.emit({type: 'CONNEXION_IMPOSSIBLE'});
      });

    //this.db.replicate.from(this.dbRemote, tempOptions);
    //this.db.replicate.to(this.dbRemote, tempOptions);
  }

  /**
   * Handle changes
   * @param change
   */
  handleChange(change) {
    console.log(change.doc.documentType);
    this.changes.emit({type: change.doc.documentType, doc: change.doc});
  }

  /**
   * Add a new external database to the local databse
   * @param {string} databaseName
   * @param {any} options
   * @returns {Promise<any>}
   */
  addDatabase(databaseName: string, options = this.options) {
    return new Promise(resolve => {
      if (this.dbList.indexOf(databaseName) !== -1) {
        resolve(databaseName);
      } else {
        this.dbList.push(databaseName);
        this.dbSync.filter = function (doc) {
          for (const db of this.dbList) {
            console.log(db);
            if (doc.dbName === db) {
              console.log("ok");
              return true;
            }
          }
          return false;
        };
        resolve(databaseName);
      }
    });
  }

  createDatabase(databaseName: string, options = this.options) {
    return new Promise(resolve => {
      const guid = this.guid();
      const newDbName = `${databaseName}_${guid}`;
      this.dbList.push(databaseName);
      this.dbSync.filter = function (doc) {
        for (const db of this.dbList) {
          console.log(db);
          if (doc.dbName === db) {
            console.log("ok");
            return true;
          }
        }
        return false;
      };
      resolve(newDbName);
    });
  }

  /**
   * add document to a database
   * @param document
   * @returns {Promise<any>}
   */
  addDocument(document: any) {
    return new Promise(resolve => {
      this.db.put(document)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          console.log(`Error in database service whith call to addDocument:
          ${err}`);
        });
    });
  }

  ereaseDatabase(dbName) {
    return new Promise(resolve => {
      return this.dbRemote.allDocs({include_docs: true}).then(docs => {
        console.log(docs);
        const promises = docs.rows.map((doc) => {
          if (doc.doc.dbName === dbName) {
            console.log("deleted_doc :", doc.doc);
            doc.doc._deleted = true;
            return this.updateDocument(doc.doc);
          }
        });
        return Promise.all(promises);
      }).then(res => {
        resolve(res);
      });
    });
  }

  /**
   * Get a document from a database
   * @param {string} docId
   * @returns {Promise<any>}
   */
  getDocument(docId: string) {
    console.log(docId);
    return new Promise((resolve, reject) => {
      return this.db.allDocs().then(res => {
        console.log(res, docId);
      })
        .then(() => {
          return this.db.get(docId);
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(`Error in database service whith call to getDocument:
          ${err}`);
          reject(err);
        });
    });
  }

  /**
   * Generates a GUID string.
   * @returns {String} The generated GUID.
   * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
   * @author Slavik Meltser (slavik@meltser.info).
   * @link http://slavik.meltser.info/?p=142
   */
  guid() {
    function _p8(s) {
      const p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }

    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
  }

  /**
   * Update an existing document
   * @param {any} doc
   */
  updateDocument(doc: any) {
    return new Promise((resolve, reject) => {
      console.log("toto");
      this.db.put(doc)
        .then(res => {
          console.log("test");
          resolve(res);
        })
        .catch(err => {
          console.log(`Error in database service whith call to updateDocument:
          ${err}`);
          reject(err);
        });
    });
  }

  /**
   * Remove the specified document
   * @param id
   */
  removeDocument(documentId) {
    return new Promise(resolve => {
      this.db.get(documentId).then(document => {
        document._deleted = true;
        this.db.put(document).then(res => {
          resolve(res);
          console.log(res);
        })
          .catch(err => {
            console.log(`Error in database service whith call to deleteDocument:
          ${err}`);
          });
        //this.db.remove(document).then(res => {
        //  resolve(res);
        //});
      });
    });
  }

  getAllDocs(dbName) {
    return this.db.find({
      selector: {
        dbName: dbName
      }
    }).then(res => {
      return res;
    })
      ;
  }
}
