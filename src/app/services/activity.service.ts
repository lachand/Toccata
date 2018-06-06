import {ChangeDetectorRef, EventEmitter, Injectable, Output} from '@angular/core';
import {UserService} from './user.service';

import {AppsService} from './apps.service';
import {DatabaseService} from './database.service';
import {ResourcesService} from './resources.service';
import {isNullOrUndefined} from 'util';

@Injectable()
export class ActivityService {
  db: any;
  activityLoaded: any ;
  sisters: Array<any>;
  blocked: Array<any>;
  activitiesList: Array<any>;
  activityLoadedChild: Array<any>;
  user: any;
  userActivitiesListId: Array<any> = [];

  @Output() changes = new EventEmitter();

  /**
   * Construct the activity service for activity management
   * @param {UserService} userService The user logged-in
   * @param {AppsService} apps The service for applications management
   * @param {ResourcesService} resourcesService The service for resources management
   * @param {DatabaseService} database The service for database management
   * @param {AppsService} appsService The service for applications management >DUPLICATE TO DELETE<
   */
  constructor(public userService: UserService,
              public resourcesService: ResourcesService,
              public database: DatabaseService,
              public appsService: AppsService) {

    this.database.changes.subscribe(
      (change) => {
        if (change.type === 'Activity') {
          this.changes.emit({doc: change.doc, type: 'Main'});
          let finded = false;
          for (const user of change.doc.userList) {
            if (user === this.userService.id) {
              finded = true;
            }
          }
          // DEBUG
          finded = true;
          if (change.doc.type === 'Main' && finded) {
            this.changes.emit({doc: change.doc, type: 'Main'});
            if ((change.doc.master === false && userService.fonction !== 'Enseignant') ||
              (change.doc.master === true )) {
              console.log(change);
              if (this.activitiesList.indexOf(change.doc._id) === -1) {
                this.activitiesList.push(change.doc._id);
              }
              console.log(this.activityLoaded._id, change.doc._id);
              if (!isNullOrUndefined(this.activityLoaded) && change.doc._id === this.activityLoaded._id) {
                this.load_activity(change.doc._id);
              }
            }
          } else if (finded) {
            this.changes.emit({doc: change.doc, type: 'Sequence'});
            if (!isNullOrUndefined(this.activityLoaded) && change.doc._id === this.activityLoaded._id) {
              this.load_activity(change.doc._id);
            }
          }
          this.changes.emit({doc: change.doc, type: 'Activity'});
        }
      }
    );

    this.user = userService;
    this.activityLoaded = null;
    this.activityLoadedChild = [];
  }

  /**
   * Get index of document in an array
   * @param document The document to retrieve index
   * @param array The arry of documents
   * @returns {number} The index of the document
   */
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

  /**
   * List all activities of user
   * @returns {any} All activities of user
   */
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

  /**
   * Unload the current activity
   */
  public unloadActivity() {
    this.activityLoaded = null;
    this.activitiesList = [];
    this.activityLoadedChild = [];
    this.appsService.logout();
  }

  /**
   * Load an activity
   * @param activity_id The activity to load
   * @returns {Promise<any>} The activity loaded
   */
  public load_activity(activity_id) {
    return new Promise(resolve => {
      this.database.getDocument(activity_id)
        .then((result) => {
        if (result['type'] === 'Main') {
          //this.sisters = this.activityLoadedChild;
          this.activityLoaded = result;
          this.activityLoadedChild = [];
          result['subactivityList'].map(elmt => {
            if (elmt['visible'] === true || this.userService.fonction === 'Enseignant') {
              this.activityLoadedChild.push(elmt['stepId']);
            }
          });
          //this.activityLoadedChild = result['subactivityList'];
          return this.resourcesService.getResources(this.activityLoaded._id);
        } else {
          this.database.getDocument(result['parent']).then(res => {
            //this.sisters = res['subactivityList'];
            this.sisters = [];
            this.blocked = [];
            res['subactivityList'].map(elmt => {
              if (elmt['visible'] === true || this.userService.fonction === 'Enseignant') {
                this.sisters.push(elmt['stepId']);
              }
              if (elmt['blocked'] === true || this.userService.fonction !== 'Enseignant') {
                this.blocked.push(elmt['stepId']);
              }
            });
            this.activityLoadedChild = [];
            this.activityLoaded = result;
            //this.activityLoadedChild = result['subactivityList'];
            result['subactivityList'].map(elmt => {
              if (elmt['visible'] === true || this.userService.fonction === 'Enseignant') {
                this.activityLoadedChild.push(elmt['stepId']);
              }
            });
            return this.resourcesService.getResources(this.activityLoaded._id);
          });
        }
        })
        .then(() => {
          return this.appsService.getApplications(this.activityLoaded._id);
        })
        .then(() => {
          return this.userService.getParticipants(this.activityLoaded._id);
        })
        .then(() => {
            this.changes.emit({doc: this.activityLoaded, type: 'ChangeActivity'});
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
   * Change the current activity
   * @param activityId The activity to load
   * @returns {Promise<any>} The activity loaded
   */
  setCurrentActivity(activityId) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId).then(doc => {
        if (doc['type'] === 'Main') {
          doc['currentLoaded'] = doc['_id'];
          return this.database.updateDocument(doc).then(res => {
            resolve(res);
          });
        } else {
          return this.database.getDocument(doc['parent']).then(parent => {
            parent['currentLoaded'] = doc['_id'];
            return this.database.updateDocument(parent).then(res => {
              resolve(res);
            });
          });
        }
      });
    });
  }

  /**
   * Create a new empty activity
   * @returns {Promise<any>} The activity created
   */
  public createActivity(activityType) {
    let dbName = '';
    return new Promise((resolve, reject) => {
      this.database.createDatabase('activity').then((newDatabase: string) => {
        dbName = newDatabase;
        const activityToCreate = {
          _id: dbName,
          type: activityType,
          name: 'Nouvelle activité',
          description: `Nouvelle description`,
          userList: [this.user.id],
          subactivityList: [],
          duplicateList : [],
          resourceList: [],
          visible: true,
          blocked: false,
          currentLoaded: dbName,
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
          console.log('here');
          return this.database.updateDocument(userDoc);
        })
        .then(res => {
          console.log('resolved');
          console.log(dbName, res);
          this.activitiesList.push(dbName);
          resolve(dbName);
        })
        .catch(err => {
          console.log(`Error in activity service whith call to createActivity:
          ${err}`);
      });
    });
  }

  /**
   * Get list of activities and connect to databases
   * @returns {any} List of activities
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
   * @param activityId The activity to retrieve informations
   * @returns {Promise<any>} Informations about activity
   */
  public getActivityInfos(activityId) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId).then(activity => {
        resolve({
          name: activity['name'],
          description: activity['description'],
          image: activity['image'],
          dbName: activity['dbName'],
          master: activity['master'],
          applicationList: activity['applicationList'],
          currentLoaded: activity['currentLoaded'],
          subactivityList: activity['subactivityList'],
          nameForTeacher: activity['nameForTeacher'],
          visible: activity['visible'],
          blocked: activity['blocked']
        });
      }).catch(err => {
        console.log(`Error in activity service whith call to getActivityInfos :
          ${err}`);
      });
    });
  }

  /**
   * Create an activity which is a child of the current activity
   * @param parentId The parent activity
   * @returns {Promise<any>} The created activity
   */
  public createSubActivity(parentId) {
    return new Promise(resolve => {
      let subActivity;
      return this.database.getDocument(parentId)
        .then(parent => {
          subActivity = {
            _id: `activity_${this.database.guid()}`,
            name: 'nouvelle étape',
            description: 'Il n\'y a aucune description',
            userList: parent['userList'],
            resourceList: parent['resourceList'],
            applicationList: parent['applicationList'],
            parent: parent['_id'],
            type: 'Sequence',
            subactivityList: [],
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
          parent['subactivityList'].push(
            {
              "stepId": subActivity._id,
              "visible": true,
              "blocked": false
            });
          return this.database.updateDocument(parent);
        })
        .then(() => {
        this.activityLoadedChild.push(subActivity._id);
          resolve(subActivity);
        })
        .catch(err => {
          console.log(`Error in activity service whith call to createSubActivity :
          ${err}`);
        });
    });
  }

  /**
   * Delete a specified activity
   * @param activityId The Id of the activity to delete
   */
  deleteActivity(activityId) {
    console.log('delete activity');
  }

  /**
   * Get all participants of an activity
   * @param activityId The activity to retrieve participants
   * @returns {any | Promise<any>} List of participants
   */
  getParticipants(activityId) {
    return this.user.getParticipants(activityId);
  }

  /**
   * Delete a specified activity
   * @param activityId The activity to delete
   * @returns {Promise<any>} The deleted activity
   */
  public delete_activity(activityId: any) {
    const childs = [];
    let deletedActivity;

    return new Promise((resolve, reject) => {
      this.database.db.get(activityId)
        .then(res => {
          // A Nettoyer
          if (res.parent !== null) {
            this.database.db.get(res.parent).then(parent => {
              parent.child.splice(parent.child.indexOf(activityId), 1);
              this.database.db.put(parent);
            });
          }
          res._deleted = true;
          deletedActivity = res;
          return this.database.db.query('byParent/by-parent',
            {startkey: res._id, endkey: res._id});
        })
        .then(activityChilds => {
          activityChilds.rows.map((row) => {
            childs.push(row.value);
          });
          return this.user.remove_activity(activityId);
        })
        .then(res1 => {
          return this.appsService.remove_activity(activityId);
        })
        .then(res2 => {
          return this.database.db.put(deletedActivity);
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

  /**
   * Duplicate an activity
   * @param activityId The activity to duplicate
   * @param duplicateName Name of the duplicate
   * @returns {Promise<any>} The duplicated activity
   */
  duplicate(activityId, duplicateName) {
    return new Promise((resolve, reject) => {
      let newActivityCreated;
      this.database.db.get(activityId).then(res => {
        const newActivity = {
          'name': 'Copie de ' + res.name,
          'participants': [this.user.id]
        };
        return this.database.db.post(newActivity);
      })
        .then(activityCreated => {
          newActivityCreated = activityCreated;
          return this.appsService.duplicateAppsFromActivity(activityId, activityCreated.id);
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

  /**
   * Unload activity before user logout
   */
  logout() {
    this.unloadActivity();
    this.user.logout();
  }

  /**
   * Change the value corresponding of a key in an activity
   * @param {string} key The key of change
   * @param {String} value The new value
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
   * @param userName The user to add
   * @param activityId The Id of the activity where change occurs
   */
  addUser(userName: any, activityId: any) {
    const tempThis = this;
    return new Promise(resolve => {
      return this.database.getDocument(activityId)
        .then(activity => {
          activity['userList'].push(userName);
          const subactivities = activity['subactivityList'];
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
   * @param userName The user to remove
   * @param activityId The Id of the activity where change occurs
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

  /**
   * Duplicate a specified activity in a new database
   * @param activityId The activity to duplicate
   * @param duplicateName The name of the duplicate
   */
  duplicateActivity(activityId: any, duplicateName: any) {
    return new Promise(resolve => {
      let dbName, guid, newDb, activity;
      return this.database.getDocument(activityId).then(activityDoc => {
        activity = activityDoc;
        dbName = activity['dbName'];
        guid = this.database.guid();
        newDb = `${dbName}_duplicate_${guid}`;
        return this.database.addDatabase(newDb);
      })
        .then(() => {
          return this.database.getAllDocs(dbName);
        })
        .then(docs => {
          console.log(docs.docs);
          return Promise.all(docs.docs.map(row => {
            const doc = row;
            doc.dbName = newDb;
            doc._id = `${doc._id}_duplicate_${guid}`;
            doc.nameForTeacher = duplicateName;
            if (doc.documentType === 'Activity') {
              const ressources = [];
              for (const resource of doc.resourceList) {
                ressources.push(`${resource}_duplicate_${guid}`);
              }
              const applications = [];
              for (const application of doc.applicationList) {
                applications.push(`${application}_duplicate_${guid}`);
              }
              const subactivities = [];
              for (const subactivity of doc.subactivityList) {
                subactivities.push(`${subactivity}_duplicate_${guid}`);
              }
              doc.userList = [this.userService.id];
              if (doc.master) {
                doc.master = false;
                doc.masterActivity = dbName;
              }
              doc.resourceList = ressources;
              doc.applicationList = applications;
              doc.subactivityList = subactivities;
              doc.duplicateList = [];
              if (!isNullOrUndefined(doc.parent)) {
                doc.parent = `${doc.parent}_duplicate_${guid}`;
              }
              if (!isNullOrUndefined(doc.currentLoaded)) {
                doc.currentLoaded = `${doc.currentLoaded}_duplicate_${guid}`;
              }
            } else if (doc.documentType === 'Ressource application') {
              doc.application = `${doc.application}_duplicate_${guid}`;
            } else if (doc.documentType === 'Resource') {
              doc.activity = `${doc.activity}_duplicate_${guid}`;
            }
            delete doc._rev;
            return this.database.addDocument(doc);
          }));
        })
        .then(() => {
          activity['duplicateList'].push(newDb);
          this.database.updateDocument(activity).then( res => {
            console.log(res);
            resolve(res);
          });
        })
        .catch(err => {
          console.log(`Error in activity service whith call to duplicateActivity :
          ${err}`);
        });
    });
  }

  /**
   * List all duplicates of an activity
   * @param activityId The activity to list duplicates
   * @returns {Promise<any>} The list of duplicates
   */
  getActivityDuplicate(activityId: any) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId).then(activity => {
        resolve(activity['duplicateList']);
      });
    });
  }

  /**
   * Change the value of the state of the step
   * @param activityId The activity to change the value
   */
  switchLock(activityId) {
    return new Promise(resolve => {
      let state;
      let activityToSwitch;
      return this.database.getDocument(activityId)
        .then(activity => {
          state = !activity['blocked'];
          activity['blocked'] = state;
          activityToSwitch = activity;
          return this.database.updateDocument(activity);
        })
        .then(res => {
          if (activityToSwitch['type'] === 'Sequence') {
            return this.database.getDocument(activityToSwitch['parent']);
          } else {
            resolve(res);
          }
        })
        .then(parent => {
          parent['subactivityList'].map(elmt => {
            if (elmt['stepId'] === activityToSwitch['_id']) {
              elmt['blocked'] = state;
            }
          });
          return this.database.updateDocument(parent);
        })
        .then(doc => {
          resolve(doc);
        });
    });
  }

  /**
   * Change the value of the visibility of the step
   * @param activityId The activity to change the value
   */
  switchVisibility(activityId) {
    return new Promise(resolve => {
      let state;
      let activityToSwitch;
      return this.database.getDocument(activityId)
        .then(activity => {
          state = !activity['visible'];
          activity['visible'] = state;
          activityToSwitch = activity;
          return this.database.updateDocument(activity);
        })
        .then(res => {
          if (activityToSwitch['type'] === 'Sequence') {
            return this.database.getDocument(activityToSwitch['parent']);
          } else {
            resolve(res);
          }
        })
        .then(parent => {
          parent['subactivityList'].map(elmt => {
            if (elmt['stepId'] === activityToSwitch['_id']) {
              elmt['visible'] = state;
            }
          });
          return this.database.updateDocument(parent);
        })
        .then(doc => {
          resolve(doc);
        });
    });
  }
}
