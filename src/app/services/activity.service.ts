import {EventEmitter, Injectable, Output} from '@angular/core';
import {UserService} from './user.service';

import * as config from '../../variables';
import PouchDB from 'pouchdb';
import Pouchfind from 'pouchdb-find';
import {AppsService} from './apps.service';
PouchDB.plugin(Pouchfind);

@Injectable()
export class ActivityService {
  db: any;
  db_remote: any;
  activity_loaded: any;
  activities_list: Array<any>;
  user: any;
  apps: AppsService;
  @Output() changes = new EventEmitter();

  constructor(userService: UserService, appsService: AppsService) {
    this.db = new PouchDB('activites');
    this.db_remote = new PouchDB(config.HOST + ':' + config.PORT + '/activites');
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.db.sync(this.db_remote, options).on('change', function (change) {
      this.handleChange(change);
    }).on('paused', function (info) {
      // replication was paused, usually because of a lost connection
    }).on('active', function (info) {
      // replication was resumed
    }).on('error', function (err) {
      // totally unhandled error (shouldn't happen)
    });
    this.user = userService;
    this.apps = appsService;
    this.activity_loaded = null;
  }

  public getActivities() {
    const name = this.user.id;
    if (this.activities_list && this.activities_list.length > 0) {
      return Promise.resolve(this.activities_list);
    }
    return new Promise(resolve => {
      this.db.query('byParticipant/by-participant',
        { startkey: name, endkey: name}).then(result => {
        this.activities_list = [];
        result.rows.map((row) => {
          this.activities_list.push(row.value);
        });
        resolve(this.activities_list);
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch(console.log.bind(console));
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
          }).catch(console.log.bind(console));
        }).catch(console.log.bind(console));
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          if (change.id === this.activity_loaded._id) {
            this.activity_loaded = change.doc;
            this.changes.emit(change);
          }
        });
      }).catch(console.log.bind(console));
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
          if (change.doc.participants.indexOf(this.user.name) !== -1){
            this.activities_list.splice(changedIndex, 1);
          } else {
            this.activities_list[changedIndex] = change.doc;
            this.changes.emit({changeType: 'modification', value: change.doc});
          }
        } else {
          if (change.doc.participants.indexOf(this.user.name) !== -1) {
            this.activities_list.push(change.doc);
            this.changes.emit({changeType: 'create', value: change.doc});
          }
        }
    } else {
      console.log(change);
      this.activities_list.splice(this.activities_list.indexOf(change.doc.id), 1);
      this.changes.emit({changeType: 'delete', value: change});
      }
  }

  public delete_activity(activityId: any) {
    console.log(this, this.user);
    this.db.get(activityId).then( res => {
      res._deleted = true;
      this.user.remove_activity(activityId);
      this.apps.remove_activity(activityId).then( res2 => {
        this.db.put(res);
      }
      ).catch(console.log.bind(console));
    }).catch(console.log.bind(console));
  }

  duplicate(activityId) {
    this.db.get(activityId).then( res => {
      const newActivity = {
        'name': 'Copie de ' + res.name,
        'participants': res.participants
      }
      this.db.post(newActivity).then( resActivity => {
        this.apps.duplicateAppsFromActivity(activityId, resActivity.id).then(
          this.user.duplicateUsersFromActivity(activityId, resActivity.id)
        ).catch(console.log.bind(console));
      }).catch(console.log.bind(console));
    }).catch(console.log.bind(console));
  }

  logout() {
    this.activity_loaded = null;
    this.activities_list = [];
    this.apps.logout();
    this.user.logout();
  }
}
