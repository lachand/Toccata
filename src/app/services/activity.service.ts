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
  activity_loaded_child: any;
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
    this.db.sync(this.db_remote, options).on('change', change => {
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
    this.activity_loaded_child = [];
  }

  public getActivities() {
    const name = this.user.id;
    if (this.activities_list && this.activities_list.length > 0) {
      return Promise.resolve(this.activities_list);
    }
    return new Promise(resolve => {
      this.db.query('byParticipant/by-participant',
        {startkey: name, endkey: name})
        .then(result => {
          this.activities_list = [];
          result.rows.map((row) => {
            this.activities_list.push(row.value);
          });
          resolve(this.activities_list);
        }).catch(console.log.bind(console));
    }).catch(console.log.bind(console));
  }

  public load_activity(activity_id) {
    if (this.activity_loaded && this.activity_loaded._id === activity_id) {
      return Promise.resolve(this.activity_loaded);
    }
    return new Promise(resolve => {
      this.db.get(activity_id, {
        include_docs: true
      })
        .then((result) => {
          this.activity_loaded = result;
          this.apps.getApps(result._id)
            .then(() => {
              return this.user.getParticipants(result._id);
            })
            .then(() => {
              return this.db.query('byParent/by-parent',
                {startkey: result._id, endkey: result._id});
            })
            .then(activityChilds => {
              this.activity_loaded_child = [];
              activityChilds.rows.map((row) => {
                this.activity_loaded_child.push(row.value);
                resolve(this.activity_loaded);
              });
            });
        });
    });
  }

  public unloadActivity() {
    this.activity_loaded = null;
    this.activities_list = [];
    this.activity_loaded_child = []
    this.apps.logout();
  }

  public createActivity(activity) {
    return new Promise((resolve, reject) => {
      this.db.post(activity)
        .then(response => resolve(response)).catch(function (err) {
        console.log(err);
        reject(err);
      });
    });
  }

  public createSubActivity(parentId) {
    return new Promise((resolve, reject) => {
      this.db.get(parentId).then(parent => {
        const subActivity = {
          'name': 'nouvelle activité',
          'participants': parent.participants,
          'parent': parent._id,
          'type': 'Sequence',
          'description': "Il n'y a aucune description"
        };
        return this.db.post(subActivity);
      })
        .then((response) => {
          resolve(response);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  }

  getParticipants(activityId) {
    return this.user.getParticipants(activityId);
  }

  public delete_activity(activityId: any) {
    const childs = [];
    let deletedActivity;

    return new Promise((resolve, reject) => {
      this.db.get(activityId)
        .then(res => {
          res._deleted = true;
          deletedActivity = res;
          return this.db.query('byParent/by-parent',
          { startkey: res._id, endkey: res._id}); })
        .then(activityChilds => {
          activityChilds.rows.map((row) => {
            childs.push(row.value);
          });
          return this.user.remove_activity(activityId); })
        .then(res1 => {
          return this.apps.remove_activity(activityId); })
        .then(res2 => {
          return this.db.put(deletedActivity); })
        .then(activityDeleted => {
          if (childs.length > 0) {
            return Promise.all(childs.map( (child) => {
              return this.delete_activity(child._id).then(finalRes => {
                resolve(finalRes);
              });
            }));
          } else { resolve(activityDeleted); }
        });
    });
  }

  duplicate(activityId) {
    return new Promise((resolve, reject) => {
      let newActivityCreated;
      this.db.get(activityId).then(res => {
        const newActivity = {
          'name': 'Copie de ' + res.name,
          'participants': [this.user.id]
        }
        return this.db.post(newActivity);
      })
        .then(activityCreated => {
          newActivityCreated = activityCreated;
          return this.apps.duplicateAppsFromActivity(activityId, activityCreated.id);
        })
        .then(() => {
          return this.user.addActivity(newActivityCreated.id, this.user.id);
        })
        .then(() => {
          return this.user.addActivity(newActivityCreated.id, this.user.id);
        }).catch(function (err) {
        console.log(err);
        reject(err);
      });
    });
  }

  logout() {
    this.unloadActivity();
    this.user.logout();
  }

private handleChange(change) {
  for (const document of change.change.docs) {
    if (!document._deleted) {
      let changedDoc = null;
      let changedIndex = null;
      this.activities_list.forEach((doc, index) => {
        console.log(doc, document);
        if (doc._id === document._id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });
      if (changedDoc) {
        if (document.participants.indexOf(this.user.id) === -1) {
          this.activities_list.splice(changedIndex, 1);
        } else {
          this.activities_list[changedIndex] = document;
          if (document._id === this.activity_loaded._id) {
            this.activity_loaded = document;
          }
          this.changes.emit({changeType: 'modification', value: document});
        }
      } else {
        if (document.participants.indexOf(this.user.id) !== -1) {
          if (document.type === 'Main') {
            this.activities_list.push(document);
          } else if (document._id !== this.activity_loaded._id) {
            this.activity_loaded_child.push(document);
          } else {
            console.log("this is the good one");
            this.activity_loaded = document;
            console.log(this.activity_loaded);
            this.changes.emit({changeType: 'modification', value: document});
          }
          this.changes.emit({changeType: 'create', value: document});
        }
      }
    } else {
      this.activities_list.splice(this.activities_list.indexOf(document._id), 1);
      this.changes.emit({changeType: 'delete', value: change});
    }
  }
}

}
