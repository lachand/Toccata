import PouchDB from 'pouchdb';
import {EventEmitter, Inject, Output} from '@angular/core';
import * as config from 'variables';
import {Http} from '@angular/http';

export class AppsService {
  appsDb: any;
  appsDbRemote: any;
  apps: any;
  appsSync: any;

  @Output()
  change = new EventEmitter();

  constructor(@Inject(Http) public http: Http) {
    this.appsDb = new PouchDB('applications');
    this.appsDbRemote = new PouchDB(config.HOST + config.PORT + '/applications');
    const options = {
      live: true,
      retry: true,
      continuous: true,
      timeout: false,
      heartbeat: false,
      ajax: {
        timeout: false,
        hearbeat: false
      }
    };
    this.appsSync = this.appsDb.sync(this.appsDbRemote, options);
    this.appsDb.changes({
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
    this.apps = {};

  }

  public getApps(activityId) {
    const name = activityId;
    if (this.apps[name] && this.apps[name].length > 0) {
      return Promise.resolve(this.apps[name]);
    }
    return new Promise(resolve => {
      this.appsDb.query('byActivity/by-activity',
        { startkey: name, endkey: name}).then(result => {
          this.apps[name] = [];
          const docs = result.rows.map((row) => {
            this.apps[name].push(row.value);
          });
        resolve(this.apps[name]);
      }).catch(console.log.bind(console));
    }).catch((error) => {
      console.log(error);
    });
  }

  public createApp(app) {
    this.appsDb.post(app).then((response) => {
      this.appsDb.get(response.id).then(appAdded => {
        console.log(appAdded);
        if (appAdded.type === 'Feuille de calcul') {
          appAdded.url = 'https://framacalc.org/' + appAdded._id;
        } else if (appAdded.type === 'Editeur de texte') {
          appAdded.url = 'https://annuel2.framapad.org/p/' + appAdded._id;
        } else { return true; }
        this.http.get(appAdded.url);
        this.appsDb.put(appAdded).then(() => {
          return true;
        });
      });
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  public unloadApp(appId) {
    this.appsDb.get(appId).then(res => {
      res.status = 'unloaded';
      return this.appsDb.put(res);
    }).catch(console.log.bind(console));
  }

  public loadApp(appId) {
    this.appsDb.get(appId).then(res => {
      res.status = 'loaded';
      return this.appsDb.put(res);
    }).catch(console.log.bind(console));
  }

  public getApp(appId) {
    return this.appsDb.get(appId);
  }

  public deleteApp(appId) {
    this.appsDb.get(appId).then(res => {
      res._deleted = true;
      return this.appsDb.put(res).then(result => {
          return result;
        }
      );
    }).catch(console.log.bind(console));
  }

  getIndexOf(document, array) {
    let i = 0;
    for (const element of array){
        if (element._id === document._id) {
          return i;
        }
        i = i + 1;
      }
    return -1;
    }

  remove_activity(activityId) {
    return new Promise(resolve => {
      this.appsDb.query('byActivity/by-activity',
        {startkey: activityId, endkey: activityId}).then(result => {
        const apps = [];
        const docs = result.rows.map((row) => {
          apps.push(row.value);
        });
        for (const app of apps) {
            app._deleted = true;
          }
        this.appsDb.bulkDocs(apps).then(res => {
          resolve(res);
        });
      }).catch(console.log.bind(console));
    });
  }

  duplicateAppsFromActivity(inputActivity, outputActivity) {
    this.appsDb.query('byActivity/by-activity',
      { startkey: inputActivity, endkey: inputActivity}).then(result => {
      const apps = [];
        const docs = result.rows.map((row) => {
          row.value.activity = outputActivity;
          delete row.value._id;
          delete row.value._rev;
          apps.push(row.value);
        });
        console.log(apps);
      const db = this.appsDb;
      return Promise.all(apps.map(function (app) {
        console.log(db);
        return db.post(app);
      })).then(function (arrayOfResults) {
        console.log(arrayOfResults);
      });
    }).catch(console.log.bind(console));
  }

  private handleChange(change) {
    const document = change.doc;
    console.log(document);
    if (!document._deleted) {
      let changedDoc = null;
      let changedIndex = null;
      this.apps[document.activity].forEach((doc, index) => {
        if (doc._id === document._id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });
      if (changedDoc) {
        this.apps[document.activity][changedIndex] = document;
        this.change.emit({changeType: 'modification', value: document});
      } else {
        this.apps[document.activity].push(document);
        this.change.emit({changeType: 'create', value: document});
      }
    } else {
      for (const activity in this.apps) {
        this.apps[activity].splice(this.getIndexOf(document, this.apps[activity]), 1);
        /** Tricky way **/
        this.change.emit({changeType: 'delete', value: change});
        console.log(this.apps);
      }
    }
  }

  logout() {
    this.apps = [];
  }
}
