import PouchDB from 'pouchdb';
import * as config from 'variables';
import {EventEmitter, Output} from '@angular/core';

export class RessourcesService {
  ressources_db: any;
  ressources_db_remote: any;
  ressources: any;
  temp_changes: Array<any>;

  @Output()
  change = new EventEmitter();

  constructor() {
    //this.messages_db = new PouchDB('messages');
    this.temp_changes = [];
    this.ressources_db = new PouchDB('ressources');
    this.ressources_db_remote = new PouchDB(config.HOST + ':' + config.PORT + '/ressources');
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.ressources_db.sync(this.ressources_db_remote, options).on('change', function (change) {
      this.handleChange(change);
    }).on('paused', function (info) {
    }).on('active', function (info) {
    }).on('error', function (err) {
      // totally unhandled error (shouldn't happen)
    });
    this.ressources = {};

  }
  getRessources(app) {
    const name = app.id;
    if (this.ressources[name]) {
      return Promise.resolve(this.ressources[name]);
    }
    return new Promise(resolve => {
      this.ressources_db.query('byApplication/by-application',
        { startkey: name, endkey: name}).then(result => {
          this.ressources[name] = [];
          const docs = result.rows.map((row) => {
            this.ressources[name].push(row.value);
          });
        resolve(this.ressources[name]);
      });
      this.ressources_db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
        this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  createRessource(ressource) {
    this.ressources_db.post(ressource).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  deleteRessource(ressource) {
    this.ressources_db.remove(ressource).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  handleChange(change) {
    if (!change.deleted) {
    for (let i = 0; i < change.doc.applications.length; i++) {
      let changedDoc = null;
      let changedIndex = null;
        this.ressources[change.doc.applications[i]].forEach((doc, index) => {
          if (doc._id === change.doc._id) {
            changedDoc = doc;
            changedIndex = index;
          }
        });
        if (changedDoc) {
          this.ressources[change.doc.applications[i]][changedIndex] = change.doc;
          this.change.emit({changeType: 'modification', value: change.doc});
        } else {
          this.ressources[change.doc.applications[i]].push(change.doc);
          this.change.emit({changeType: 'create', value: change.doc});
        }
        }
      } else {
      this.ressources_db.get(change.doc._id).then( res => {
        console.log(res);
      });
      console.log('toto : ', change);
    }
  }
}
