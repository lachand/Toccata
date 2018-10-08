import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';
import {environment} from '../../environments/environment';
import {isNullOrUndefined} from 'util';
import {errorHandler} from '@angular/platform-browser/src/browser';

@Injectable()

export class DatabaseService {

  db: any;
  dbRemote: any;
  dbList: Array<any> = [];
  options: any;
  optionsReplication: any;
  dbSync: any;
  dbNames: Array<string> = [];
  canConnect: boolean;
  room: string;
  @Output() changes = new EventEmitter();

  /**
   * Construct the service to communicate with the local and remote database
   */
  constructor() {

    require('events').EventEmitter.defaultMaxListeners = 0;

    PouchDB.plugin(PouchdbFind);
    PouchDB.plugin(require('pouchdb-authentication'));
    PouchDB.plugin(require('pouchdb-upsert'));

    console.log(environment);

    this.room = environment.ROOM;
    this.canConnect = false;

    this.dbRemote = new PouchDB(`${environment.URL_DB}/${environment.DB}`, {
      auth: {
        username: `${environment.USERNAME_DB}`,
        password: `${environment.PASSWORD_DB}`
      },
    skipSetup: true
    }
      );

    this.changes.subscribe(event => {
    });

    this.addDatabase('user_list');

    this.db = new PouchDB(environment.DB);
    this.db.info().then(info => {
      console.log(info);
      if (info.db_name !== environment.DB) {
        this.db.destroy().then( () => {
          this.db = new PouchDB(environment.DB);
          this.initialize();
        });
      } else {
        this.initialize();
      }
    }).catch(err => {
      console.log("Error while duplicating database, failsafe mode activated");
      this.db = this.dbRemote;
      this.initialize();
    });
  }

  initialize() {
    this.db.replicate.to(this.dbRemote, {retry: true}).on('complete', () => {
      console.info(`Replication to remote completed`);
      this.dbList.push('user_list');
      this.dbList.push('activity_6c606a2b-a011-5fe5-ac20-c11a692e0499');
      console.log(this.dbList);
      return this.db.replicate.from(this.dbRemote,
        {
          retry: true,
          //filter: 'app/by_dbName',
          //query_params: {'databases': this.dbList}
        }
        ).on('complete', () => {
        console.info(`Replication from remote complete`);
        this.changes.emit('CONNEXION_DONE');
        this.canConnect = true;
        return this.db.sync(this.dbRemote, {
          retry: true,
          //filter: 'app/by_dbName',
          //query_params: {'databases': this.dbList}
        }).on('change', change => {
          console.log(change);
          this.handleChange(change);
        }).on('paused', info => {
          console.log(info);
        }).on('active', () => {
        }).on('denied', err => {
          console.error(err);
        }).on('error', err => {
          console.error(`Sync error ${err}`);
        });
      }).on('From remote change', change => {
        console.info(change);
      }).on('paused', info => {
        console.info('From remote pause: ', info);
      }).on('active', () => {
        console.info('From remote active: ');
      }).on('denied', err => {
        console.error(err);
      }).on('error', err => {
        console.error(`Replication from remote error ${err}`);
      });
    }).on('change', change => {
      console.info(change);
    }).on('paused', function (info) {
      console.info('To remote pause: ', info);
    }).on('active', function (info) {
      console.info('To remote active: ', info);
    }).on('error', err => {
      console.error(`Replication to remote error ${err}`);
    });
  }

  sync() {
    console.info('sync');
    const options = {
      live: true,
      retry: true,
      continuous: true,
      //revs_limit: 2,
      //filter: 'appFilters/by_db_name',
      //query_params: {'dbNames': this.dbList}
    };
    //console.log(options.query_params);
  }

  /**
   *
   * Handle changes
   * @param change change that occurs
   */
  handleChange(change) {
    console.log(change, change.change.docs[0].documentType, change.change.docs[0]);
    this.changes.emit({type: change.change.docs[0].documentType, doc: change.change.docs[0]});
  }

  handleChangeRemote(change) {

    return 0;
  }

  forceUpdateDocument(doc) {
    const tmp_this = this;
    return this.db.get(doc._id).then((origDoc, tmp_this) => {
      doc._rev = origDoc._rev;
      return tmp_this.db.put(doc);
    }).catch(function (err) {
      if (err.status === 409) {
        return tmp_this.updateDocument(doc);
      } else { // new doc
        return tmp_this.db.put(doc);
      }
    });
  }


  /**
   * Add a new external database to the local databse
   * @param {string} databaseName The new database to add
   * @param {any} options Options of replication
   * @returns {Promise<any>} Return the database
   */
  addDatabase(databaseName: string, options = this.options) {
    return new Promise(resolve => {
      if (this.dbList.indexOf(databaseName) !== -1) {
        resolve(databaseName);
      } else {
        this.dbList.push(databaseName);
        resolve(databaseName);
      }
    });
    }


  /**
   * Definitive supression of document
   * @param documentId The document to remove
   * @returns {Promise<any>}
   */
  ereaseDocument(documentId) {
    return new Promise(resolve => {
      return this.db.remove(documentId);
    });
  }

  /**
   * Create a new database
   * @param {string} databaseName The name of the database to create
   * @param {any} options Otpions of replication
   * @returns {Promise<any>} The created database
   */
  createDatabase(databaseName: string, options = this.options) {
    return new Promise(resolve => {
      const guid = this.guid();
      const newDbName = `${databaseName}_${guid}`;
      this.dbList.push(databaseName);
      resolve(newDbName);
    });
  }

  /**
   * add document to a database
   * @param document The document to add
   * @returns {Promise<any>} The document added
   */
  addDocument(document: any) {
    return new Promise((resolve, reject) => {
      this.db.put(document)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          console.error(`Error in database service whith call to addDocument:
          ${err}`);
          reject(err);
        });
    });
  }

  /**
   * Erase a database
   * @param dbName The database to erase
   * @returns {Promise<any>} The cofirmation of database deletion
   */
  ereaseDatabase(dbName) {
    return new Promise(resolve => {
      return this.db.allDocs({include_docs: true}).then(docs => {
        const promises = docs.rows.map((doc) => {
          if (doc.doc.dbName === dbName) {
            console.info('deleted_doc :', doc.doc);
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
   * @param {string} docId The Id of the document to retrieve
   * @returns {Promise<any>} The document
   */
  getDocument(docId: string) {
    return new Promise((resolve, reject) => {
          return this.db.get(docId)
        .then(result => {
          if (!isNullOrUndefined(result['_conflict'])) {
          }
          resolve(result);
        })
        .catch(err => {
          console.error(`Error in database service whith call to getDocument ${docId}:
          ${err}`);
          console.trace();
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
   * @param {any} doc The document to update
   */
  /**updateDocument(doc: any) {
    return new Promise((resolve, reject) => {
      this.db.get(doc._id).then(docu => {
        doc['_rev'] = docu['_rev'];
        this.db.put(doc)
          .then(res => {
            console.log(res);
            resolve(res);
          })
          .catch(err => {
            resolve(doc);
            console.log(`Error in database service whith call to updateDocument:
          ${err}. Document: ${doc['_id']}; Revision: ${doc['_rev']}`);
            //reject(err);
          });
      });
    });
  }**/

  updateDocument(doc) {
    return new Promise((resolve, reject) => {
      return this.db.upsert(doc._id, function (elmt) {
        elmt = doc;
        if (!elmt.count) {
          elmt.count = 0;
        }
        elmt.count++;
        return elmt;
      }).then(function (res) {
        resolve(res);
      }).catch(function (err) {
        console.error(err);
        reject(err);
      });
    });
  }

  /**
   * Remove the specified document
   * @param id The document to remove
   */
  removeDocument(documentId) {
    return new Promise(resolve => {
      this.db.get(documentId).then(document => {
        if (document.documentType === 'Resource' || document.documentType === 'Application') {
          const changes = [];
          this.db.find({
            selector: {documentType: 'Activity', dbName: document.dbName},
            sort: ['_id']
          }).then(function (result) {
            for (const element of result.docs){
              if (document.documentType === 'Resource') {
                const index1 = element.resourceList.indexOf(document._id);
                if (index1 !== -1) {
                  element.resourceList.splice(index1, 1);
                  changes.push(element);
                }
              } else if (document.documentType === 'Application') {
                const index2 = element.applicationList.indexOf(document._id);
                if (index2 !== -1) {
                  element.applicationList.splice(index2, 1);
                  changes.push(element);
                }
              }
            }
          }).catch(function (err) {
          });
          this.db.bulkDocs(changes).then( () => {
            document._deleted = true;

            this.db.put(document).then(res => {
              resolve(res);
            })
              .catch(err => {
                console.error(`Error in database service whith call to deleteDocument:
          ${err}`);
              });
          });
        } else {
          this.db.remove(document).then(res => {
            resolve(res);
          });
        }
      });
    });
  }

  /**
   * Retrieve all documents of database
   * @param dbName The name of the database where to retrieve al documents
   */
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

  customFilter(doc, req) {
    for (const elmt of req.query.databases) {
      return doc.dbName === elmt;
    }
  }
}
