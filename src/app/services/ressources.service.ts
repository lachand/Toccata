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
    this.ressources_db_remote = new PouchDB(config.HOST + config.PORT + '/ressources');
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.ressources_db.sync(this.ressources_db_remote, options);
    this.ressources_db.changes({
      since: 'now',
      live: true,
      include_docs: true }).on('change', change => {
      console.log(change);
      this.handleChange(change);
    }).on('paused', function (info) {
      // replication was paused, usually because of a lost connection
    }).on('active', function (info) {
      // replication was resumed
    }).on('error', function (err) {
      // totally unhandled error (shouldn't happen)
    });
    this.ressources = {};

  }
  getRessources(app) {
    const name = app.id;
    if (this.ressources[name] && this.ressources[name].length > 0) {
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
      }).catch(console.log.bind(console));
      this.ressources_db.changes({live: true, since: 'now', include_docs: true}).once('change', (change) => {
        //this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  createRessource(ressource, activityId) {
    const ressourceToAdd = {
      'name': 'ressource.name',
      'activity': activityId,
      '_attachments': {
        'filename': {
          'content_type': ressource.type,
          'data': ressource
        }
      }
    };
    this.ressources_db.post(ressourceToAdd).then((response) => {
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
    const document = change.doc;
      if (!document._deleted) {
        for (let i = 0; i < document.applications.length; i++) {
          let changedDoc = null;
          let changedIndex = null;
          this.ressources[document.applications[i]].forEach((doc, index) => {
            if (doc._id === document._id) {
              changedDoc = doc;
              changedIndex = index;
            }
          });
          if (changedDoc) {
            this.ressources[document.applications[i]][changedIndex] = document;
            this.change.emit({changeType: 'modification', value: document});
          } else {
            this.ressources[document.applications[i]].push(document);
            this.change.emit({changeType: 'create', value: document});
          }
        }
      } else {
        this.ressources_db.get(document._id).then(res => {
          console.log(res);
        }).catch(console.log.bind(console));
        console.log('toto : ', change);
      }
    }
}
