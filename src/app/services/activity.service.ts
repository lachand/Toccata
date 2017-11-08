import {EventEmitter, Injectable, Output} from '@angular/core';
import {UserService} from './user.service';

import * as config from '../../variables';
import {AppsService} from './apps.service';
import {DatabaseService} from './database.service';
import {ResourcesService} from './resources.service';
import {isNullOrUndefined} from "util";

@Injectable()
export class ActivityService {
  db: any;
  activityLoaded: any;
  activitiesList: Array<any>;
  activityLoadedChild: any;
  user: any;
  userActivitiesListId: Array<any> = [];

  @Output() changes = new EventEmitter();

  constructor(public userService: UserService,
              public apps: AppsService,
              public resourcesService: ResourcesService,
              public database: DatabaseService,
              public appsService: AppsService) {
    this.database.changes.subscribe(
      (change) => {
        if (change.type === 'Activity') {
          if (change.doc.type === 'Main') {
            this.changes.emit({doc: change.doc, type: 'Main'});

            if (change.doc._id === this.activityLoaded._id) {
              this.load_activity(change.doc._id);
            }
          } else {
            this.changes.emit({doc: change.doc, type: 'Sequence'});
          }
        }
      }
    );

    this.user = userService;
    this.activityLoaded = null;
    this.activityLoadedChild = [];
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

  public getUserActivities() {

    const name = this.user.id;

    if (this.userActivitiesListId.length > 0) {
      return Promise.resolve(this.userActivitiesListId);
    }
    return new Promise(resolve => {
      this.db.query('byParticipant/id-by-participant',
        {startkey: name, endkey: name})
        .then(result => {
          result.rows.map((row) => {
            this.userActivitiesListId.push(row.id);
          });
          resolve(this.userActivitiesListId);
        }).catch(console.log.bind(console));
    }).catch(console.log.bind(console));
  }

  public unloadActivity() {
    this.activityLoaded = null;
    this.activitiesList = [];
    this.activityLoadedChild = [];
    this.apps.logout();
  }

  /**
   * Load an activity
   * @param activity_id
   * @returns {Promise<any>}
   */
  public load_activity(activity_id) {
    return new Promise(resolve => {
      this.database.getDocument(activity_id)
        .then((result) => {
          this.activityLoaded = result;
          this.activityLoadedChild = result['subactivityList'];
          return this.resourcesService.getResources(this.activityLoaded._id);
        })
        .then(() => {
          return this.appsService.getApplications(this.activityLoaded._id);
        })
        .then(() => {
          return this.userService.getParticipants(this.activityLoaded._id);
        })
        .then(() => {
            resolve(this.activityLoaded);
          }
        )
        .catch(err => {
          console.log(`Error in activity service whith call to loadActivity:
          ${err}`);
        });
    });
  }

  /**
   * Create a new activity empty activity
   * @returns {Promise<any>}
   */
  public createActivity(activityType) {
    let dbName = '';
    return new Promise((resolve, reject) => {
      this.database.createDatabase('activity').then(newDatabase => {
        dbName = newDatabase['name'].replace(`${config.HOST}${config.PORT}/`, '');
        const activityToCreate = {
          _id: dbName,
          type: activityType,
          name: 'Nouvelle activité',
          description: `Il n'y à aucune description`,
          userList: [this.user.id],
          subactivityList: [],
          resourceList: [],
          applicationList: [],
          createdAt: Date.now(),
          dbName: dbName,
          documentType: 'Activity'
        };
        return this.database.addDocument(activityToCreate);
      })
        .then(() => {
          return this.database.getDocument(this.user.id);
        })
        .then(userDoc => {
          userDoc['activityList'].push(dbName);
          return this.database.updateDocument(userDoc);
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.log(`Error in activity service whith call to createActivity:
          ${err}`);
      });
    });
  }

  /**
   * Get list of activities and connect to databases
   * @returns {any}
   */
  public getActivities() {
    const name = this.user.id;
    if (this.activitiesList && this.activitiesList.length > 0) {
      return Promise.resolve(this.activitiesList);
    }
    return new Promise(resolve => {
      this.database.getDocument(`${this.user.id}`)
        .then(userDoc => {
          this.activitiesList = userDoc['activityList'];
          const tempThis = this;
          const promises = this.activitiesList.map(function (activityId) {
            tempThis.database.addDatabase(activityId);
          });
          return Promise.all(promises);
        })
        .then(() => {
          resolve(this.activitiesList);
        })
        .catch(err => {
          console.log(`Error in activity service whith call to getActivities : 
          ${err}`);
        });
    });
  }

  /**
   * Get informations about an activity
   * @param activityId
   * @returns {Promise<any>}
   */
  public getActivityInfos(activityId) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId).then(activity => {
        resolve({
          name: activity['name'],
          description: activity['description'],
          image: activity['image'],
          dbName: activity['dbName']
        });
      }).catch(err => {
        console.log(`Error in activity service whith call to getActivityInfos : 
          ${err}`);
      });
    });
  }

  /**
   * Create an activity which is a child of the current activity
   * @param parentId
   * @returns {Promise<any>}
   */
  public createSubActivity(parentId) {
    return new Promise(resolve => {
      let subActivity;
      return this.database.getDocument(parentId)
        .then(parent => {
          subActivity = {
            _id: `activity_${this.database.guid()}`,
            name: 'nouvelle activité',
            description: 'Il n\'y a aucune description',
            userList: parent['userList'],
            resourceList: parent['resourceList'],
            applicationList: parent['applicationList'],
            parent: parent['_id'],
            type: 'Sequence',
            subActivityList: [],
            createdAt: Date.now(),
            dbName: parent['dbName'],
            documentType: 'Activity'
          };
        })
        .then(() => {
          return this.database.addDocument(subActivity);
        })
        .then(() => {
          return this.database.getDocument(parentId);
        })
        .then(parent => {
          parent['subactivityList'].push(subActivity._id);
          return this.database.updateDocument(parent);
        })
        .then(() => {
          resolve(subActivity);
        })
        .catch(err => {
          console.log(`Error in activity service whith call to createSubActivity : 
          ${err}`);
        });
    });
  }

  deleteActivity(activityId) {
    console.log("delete activity");
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
          // A Nettoyer
          if (res.parent !== null) {
            this.db.get(res.parent).then(parent => {
              parent.child.splice(parent.child.indexOf(activityId), 1);
              console.log(parent);
              this.db.put(parent);
            });
          }
          res._deleted = true;
          deletedActivity = res;
          return this.db.query('byParent/by-parent',
            {startkey: res._id, endkey: res._id});
        })
        .then(activityChilds => {
          activityChilds.rows.map((row) => {
            childs.push(row.value);
          });
          return this.user.remove_activity(activityId);
        })
        .then(res1 => {
          return this.apps.remove_activity(activityId);
        })
        .then(res2 => {
          return this.db.put(deletedActivity);
        })
        .then(activityDeleted => {
          if (childs.length > 0) {
            return Promise.all(childs.map((child) => {
              return this.delete_activity(child._id).then(finalRes => {
                resolve(finalRes);
              });
            }));
          } else {
            resolve(activityDeleted);
          }
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
        };
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

  /**
   * Change the value corresponding of a key in an activity
   * @param {string} key
   * @param {String} value
   */
  activityEdit(activityId: string, key: string, value: String) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId)
        .then(res => {
          res[key] = value;
          return this.database.updateDocument(res);
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log(`Error in user activity whith call to activityEdit : 
          ${err}`);
        });
    });
  }

  /**
   * Add a specific user to the specified activity
   * @param userName
   */
  addUser(userName: any, activityId: any) {
    const tempThis = this;
    return new Promise(resolve => {
      return this.database.getDocument(activityId)
        .then(activity => {
          activity['userList'].push(userName);
          const subactivities = activity['subactivityList'];
          console.log(subactivities);
          if (!isNullOrUndefined(subactivities)) {
            return Promise.all(subactivities.map(function (subactivity) {
              return tempThis.addUser(userName, subactivity);
            }))
              .then(() => {
                return this.database.updateDocument(activity);
              });
          }
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.log(`Error in user activity whith call to addUser : 
          ${err}`);
        });
    });
  }

  /**
   * Remove a specific user to the specified activity
   * @param userName
   */
  removeUser(userName: any, activityId: any) {
    let subactivities;
    const tempThis = this;
    return new Promise(resolve => {
      return this.database.getDocument(activityId)
        .then(activity => {
          activity['userList'].splice(activity['userList'].indexOf(userName), 1);

          subactivities = activity['subactivityList'];

          if (!isNullOrUndefined(subactivities)) {
            return Promise.all(subactivities.map(function (subactivity) {
              return tempThis.removeUser(userName, subactivity);
            }))
              .then(() => {
                return this.database.updateDocument(activity);
              });
          }
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.log(`Error in user activity whith call to removeUser : 
          ${err}`);
        });
    });
  }
}
