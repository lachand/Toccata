import PouchDB from 'pouchdb';
import * as config from 'variables';
import {EventEmitter, Output} from '@angular/core';

export class RessourcesService {
  ressources_db: any;
  ressources_db_remote: any;
  ressources: any;
  temp_changes: Array<any>;
  resourcesSync: any;

  @Output()
  change = new EventEmitter();

  constructor() {
    //this.messages_db = new PouchDB('messages');
    this.temp_changes = [];
    this.ressources = {};
    this.ressources_db = new PouchDB('ressources');
    this.ressources_db_remote = new PouchDB(config.HOST + config.PORT + '/ressources');
    const options = {
      live: true,
      retry: true,
      continuous: true,
      timeout: 10000
    };
    this.resourcesSync = this.ressources_db.sync(this.ressources_db_remote, options);
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

  }

  /**
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
   **/

  public getRessources(activityId) {
    const name = activityId;
    if (this.ressources[name] && this.ressources[name].length > 0) {
      return Promise.resolve(this.ressources[name]);
    }
    return new Promise(resolve => {
      this.ressources_db.query('byActivity/by-activity',
        {startkey: name, endkey: name}).then(result => {
        this.ressources[name] = [];
        const docs = result.rows.map((row) => {
          this.ressources[name].push(row.value);
        });
        console.log(this.ressources);
        resolve(this.ressources[name]);
      }).catch(console.log.bind(console));
    }).catch((error) => {
      console.log(error);
    });
  }

  createRessource(ressource, activityId) {
    const ressourceToAdd = {
      'name': ressource.name,
      'activity': activityId,
      'type': ressource.type,
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

  getIndexOf(document, array) {
    let i = 0;
    for (const element of array) {
      if (element._id === document._id) {
        return i;
      }
      i = i + 1;
    }
    return -1;
  }

  private handleChange(change) {
    const document = change.doc;
    if (!document._deleted) {
      let changedDoc = null;
      let changedIndex = null;
      console.log("changed doc : ", this.ressources, this.ressources[document.activity]);
      this.ressources[document.activity].forEach((doc, index) => {
        if (doc._id === document._id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });
      console.log("changed doc bis : ", changedDoc);
      if (changedDoc) {
        console.log(this.ressources, this.ressources[document.activity]);
        this.ressources[document.activity][changedIndex] = document;
        this.change.emit({changeType: 'modification', value: document});
      } else {
        console.log("creation : ");
        this.ressources[document.activity].push(document);
        this.change.emit({changeType: 'create', value: document});
        console.log("ressources : ", this.ressources, this.ressources[document.activity]);
      }
    } else {
      for (let activity in this.ressources) {
        this.ressources[activity].splice(this.getIndexOf(document, this.ressources[activity]), 1);
        /** Tricky way **/
        this.change.emit({changeType: 'delete', value: change});
        console.log(this.ressources);
      }
    }
  }
}
