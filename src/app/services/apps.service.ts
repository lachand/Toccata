import PouchDB from 'pouchdb';
import {EventEmitter, Inject, Output} from '@angular/core';
import * as config from 'variables';
import {Http} from '@angular/http';

export class AppsService {
  apps_db: any;
  apps_db_remote: any;
  apps: any;

  @Output()
  change = new EventEmitter();

  constructor(@Inject(Http) public http: Http) {
    this.apps_db = new PouchDB('applications');
    this.apps_db_remote = new PouchDB(config.HOST + config.PORT + '/applications');
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.apps_db.sync(this.apps_db_remote, options);
    this.apps_db.changes({
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
      this.apps_db.query('byActivity/by-activity',
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
    this.apps_db.post(app).then((response) => {
      this.apps_db.get(response.id).then(appAdded => {
        console.log(appAdded);
        if (appAdded.type === 'Feuille de calcul') {
          appAdded.url = 'https://framacalc.org/' + appAdded._id;
        } else if (appAdded.type === 'Editeur de texte') {
          appAdded.url = 'https://annuel2.framapad.org/p/' + appAdded._id;
        } else { return true; }
        this.http.get(appAdded.url);
        this.apps_db.put(appAdded).then( () => {
          return true;
        });
      });
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  public unloadApp(appId) {
    this.apps_db.get(appId).then(res => {
      res.status = 'unloaded';
      return this.apps_db.put(res);
    }).catch(console.log.bind(console));
  }

  public loadApp(appId) {
    this.apps_db.get(appId).then(res => {
      res.status = 'loaded';
      return this.apps_db.put(res);
    }).catch(console.log.bind(console));
  }

  public getApp(appId) {
    return this.apps_db.get(appId);
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
          for (let activity in this.apps) {
            this.apps[activity].splice(this.getIndexOf(document, this.apps[activity]), 1);
            /** Tricky way **/
            this.change.emit({changeType: 'delete', value: change});
            console.log(this.apps);
          }
        }
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

  public deleteApp(appId) {
    this.apps_db.get(appId).then( res => {
      res._deleted = true;
      return this.apps_db.put(res).then(result => {
        return result;
      }
      );
    }).catch(console.log.bind(console));
  }

  remove_activity(activityId) {
    return new Promise(resolve => {
      this.apps_db.query('byActivity/by-activity',
        {startkey: activityId, endkey: activityId}).then(result => {
        let apps = [];
        const docs = result.rows.map((row) => {
          apps.push(row.value);
        });
        for (let app of apps) {
            app._deleted = true;
          }
        this.apps_db.bulkDocs(apps).then( res => {resolve(res); } );
      }).catch(console.log.bind(console));
    });
  }

  duplicateAppsFromActivity(inputActivity, outputActivity) {
    this.apps_db.query('byActivity/by-activity',
      { startkey: inputActivity, endkey: inputActivity}).then(result => {
        let apps = [];
        const docs = result.rows.map((row) => {
          row.value.activity = outputActivity;
          delete row.value._id;
          delete row.value._rev;
          apps.push(row.value);
        });
        console.log(apps);
        const db = this.apps_db;
      return Promise.all(apps.map(function (app) {
        console.log(db);
        return db.post(app);
      })).then(function (arrayOfResults) {
        console.log(arrayOfResults);
      });
    }).catch(console.log.bind(console));
  }

  logout() {
    this.apps = [];
  }
}
