import PouchDB from 'pouchdb';
import {EventEmitter, Output} from '@angular/core';

export class AppsService {
  apps_db: any;
  apps_db_remote: any;
  apps: any;

  @Output()
  change = new EventEmitter();

  constructor() {
    this.apps_db = new PouchDB('http://127.0.0.1:5984/applications');
    this.apps_db_remote = 'http://127.0.0.1:5984/applications';
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.apps = {};

  }

  public getApps(activityId) {
    const name = activityId;
    if (this.apps[name]) {
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
      });
      this.apps_db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
        this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  public createApp(app) {
    this.apps_db.post(app).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  public unloadApp(appId) {
    this.apps_db.get(appId).then(res => {
      res.status = 'unloaded';
      return this.apps_db.put(res);
    });
  }

  public loadApp(appId) {
    this.apps_db.get(appId).then(res => {
      res.status = 'loaded';
      return this.apps_db.put(res);
    });
  }

  public getApp(appId) {
    return this.apps_db.get(appId);
  }

  private handleChange(change) {
    if (!change.deleted) {
      for (let i = 0; i < change.doc.activites.length; i++) {
        let changedDoc = null;
        let changedIndex = null;
        this.apps[change.doc.activites[i]].forEach((doc, index) => {
          if (doc._id === change.doc._id) {
            changedDoc = doc;
            changedIndex = index;
          }
        });
        if (changedDoc) {
          this.apps[change.doc.activites[i]][changedIndex] = change.doc;
          this.change.emit({changeType: 'modification', value: change.doc});
        } else {
          this.apps[change.doc.activites[i]].push(change.doc);
          this.change.emit({changeType: 'create', value: change.doc});
        }
      }
    } else {
      for (let app in this.apps) {
        this.apps[app].splice(app, 1);
        /** Tricky way **/
        this.change.emit({changeType: 'delete', value: change});
      }
    }
  }

  public deleteApp(appId, activity_id) {
    this.apps_db.get(appId).then( res => {
        res.activites.splice(res.activites.indexOf(activity_id), 1 );
        if (res.activites.length === 0) {
          res._deleted = true;
          this.apps_db.put(res);
        } else {
          this.apps_db.put(res);
        }
    });
  }

  remove_activity(activityId) {
    this.apps_db.query('byActivity/by-activity',
      { startkey: activityId, endkey: activityId}).then(result => {
      let apps = [];
      const docs = result.rows.map((row) => {
        apps.push(row.value);
      });
      for (let app in apps) {
        apps[app].activites.splice(activityId, 1);
        if (apps[app].activite.length === 0) {
          apps[app]._deleted = true;
        }
      }
      return this.apps_db.bulkDocs(apps);
  });
  }

}
