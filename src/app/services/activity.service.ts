import {EventEmitter, Injectable, Output} from '@angular/core';
import {UserService} from './user.service';

import PouchDB from 'pouchdb';
import Pouchfind from 'pouchdb-find';
import {AppsService} from './apps.service';
PouchDB.plugin(Pouchfind);

@Injectable()
export class ActivityService {
  db: any;
  db_remote: any;
  activity_loaded: any;
  activities_list: any;
  user: any;
  apps: AppsService;
  @Output() changes = new EventEmitter();

  constructor(userService: UserService, appsService: AppsService) {
    this.db = new PouchDB('http://127.0.0.1:5984/activites');
    this.db_remote = 'http://127.0.0.1:5984/activites';
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.user = userService;
    this.apps = appsService;
    this.getActivities();
    this.activity_loaded = null;
  }

  private getActivities() {
    const name = this.user.id;
    if (this.activities_list) {
      return Promise.resolve(this.activities_list);
    }
    return new Promise(resolve => {
      this.db.query('byParticipant/by-participant',
        { startkey: name, endkey: name}).then(result => {
        this.activities_list = [];
        const docs = result.rows.map((row) => {
          this.activities_list.push(row.value);
        });
        console.log(this.activities_list);
        resolve(this.activities_list);
      });
      this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
        this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  public load_activity(activity_id) {
    if (this.activity_loaded && this.activity_loaded._id === activity_id) {
      return Promise.resolve(this.activity_loaded);
    }
    return new Promise(resolve => {
      this.db.get(activity_id, {
        include_docs: true
      }).then((result) => {
        this.activity_loaded = result;
        this.apps.getApps(result._id).then(res => {
          this.user.getParticipants(result._id).then( res2 => {
            resolve(this.activity_loaded);
          });
        });
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          if (change.id === this.activity_loaded._id) {
            this.activity_loaded = change.doc;
            console.log(this.activity_loaded);
            this.changes.emit(change);
          }
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  public createActivity(activity) {
    return new Promise(resolve => {
      this.db.post(activity).then((response) => {
        resolve(response);
      }).catch(function (err) {
        console.log(err);
        return false;
      });
    });
  }

  getParticipants(activityId) {
    return this.user.getParticipants(activityId);
  }

  private handleChange(change) {
    console.log("change : ", change);
    if (!change.deleted) {
        let changedDoc = null;
        let changedIndex = null;
        this.activities_list.forEach((doc, index) => {
          if (doc._id === change.doc._id) {
            changedDoc = doc;
            changedIndex = index;
          }
        });
        if (changedDoc) {
          this.activities_list[changedIndex] = change.doc;
          this.changes.emit({changeType: 'modification', value: change.doc});
        } else {
          this.activities_list.push(change.doc);
          this.changes.emit({changeType: 'create', value: change.doc});
        }
    } else {
      console.log(change);
      this.activities_list.splice(this.activities_list.indexOf(change.doc.id), 1);
      this.changes.emit({changeType: 'delete', value: change});
      }
  }

  public delete_activity(activityId: any) {
    if (this.activity_loaded === activityId) {
      this.activity_loaded = null;
    }
    this.db.get(activityId).then( res => {
      res._deleted = true;
      this.db.put(res).then( res2 => {
        this.apps.remove_activity(activityId);
      });
    });
  }
}
