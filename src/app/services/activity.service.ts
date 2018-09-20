import {ChangeDetectorRef, EventEmitter, Injectable, Output} from '@angular/core';
import {UserService} from './user.service';

import {AppsService} from './apps.service';
import {DatabaseService} from './database.service';
import {ResourcesService} from './resources.service';
import {isNullOrUndefined} from 'util';
import {LoggerService} from "./logger.service";

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
              public appsService: AppsService,
              public logger: LoggerService) {

    this.database.changes.subscribe(
      (change) => {
        console.log(change);
        if (change.type === 'Activity' && userService.loggedIn) {
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
              if (this.activitiesList.indexOf(change.doc._id) === -1) {
                this.activitiesList.push(change.doc._id);
              }
              if (!isNullOrUndefined(this.activityLoaded) && change.doc._id === this.activityLoaded._id) {
                this.load_activity(change.doc._id);
              }
            }
          } else if (finded) {
            console.log(change);
            this.changes.emit({doc: change.doc, type: 'Sequence'});
            if (!isNullOrUndefined(this.activityLoaded) && change.doc._id === this.activityLoaded._id) {
              this.load_activity(change.doc._id);
            }
          }
          if (change.doc._deleted) {
            let index = this.activitiesList.indexOf(change.doc._id);
            if (index > -1) {
              this.activitiesList.splice(index, 1);
            }
          }

          this.changes.emit({doc: change.doc, type: 'Activity'});

          //Sync from template
          if (change.doc.master === true) {
            let activities = this.getActivityDuplicate(this.activityLoaded._id.parent);
          }
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
      this.database.db.query('byParticipant/id-by-participant',
        {startkey: name, endkey: name})
        .then(result => {
          result.rows.map((row) => {
            if (this.activitiesList.indexOf(row.id) === -1) {
              this.userActivitiesListId.push(row.id);
            }
          });
          resolve(this.userActivitiesListId);
        }).catch(console.log.bind(console));
    }).catch(console.log.bind(console));
  }

  /**
   * Unload the current activity
   */
  public unloadActivity() {
    if (!isNullOrUndefined(this.activityLoaded)) {
      if (this.activityLoaded['_id'].indexOf('duplicate') !== -1 && this.user.fonction === 'Enseignant') {
        this.logger.log('CLOSE', this.activityLoaded._id, this.activityLoaded._id, 'close activity duplicate');
      } else {
        this.logger.log('CLOSE', this.activityLoaded._id, this.activityLoaded._id, 'close activity');
      }
      this.activityLoaded = null;
      this.activityLoadedChild = [];
      this.sisters = [];
      this.blocked = [];
    }
  }

  /**
   * Load an activity
   * @param activity_id The activity to load
   * @returns {Promise<any>} The activity loaded
   */
  public load_activity(activity_id) {
    this.unloadActivity();
    return new Promise(resolve => {
      this.database.getDocument(activity_id)
        .then((result) => {
          this.activityLoaded = result;
        if (result['type'] === 'Main') {
          if (result['_id'].indexOf('duplicate') !== -1 && this.user.fonction === 'Enseignant') {
            this.logger.log('OPEN', result['_id'], result['_id'], 'load activity duplicate');
          } else {
            this.logger.log('OPEN', result['_id'], result['_id'], 'load activity');
          }
          this.activityLoadedChild = [];
          result['subactivityList'].map(elmt => {
            if (elmt['visible'] === true || this.userService.fonction === 'Enseignant') {
              this.activityLoadedChild.push(elmt['stepId']);
            }
          });
          //this.activityLoadedChild = result['subactivityList'];
          return this.resourcesService.getResources(this.activityLoaded._id);
        } else {
          this.logger.log('OPEN', result['_id'], result['_id'], 'load step');
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
    let subactivity;
    return new Promise((resolve, reject) => {
      this.database.createDatabase('activity').then((newDatabase: string) => {
        dbName = newDatabase;
        const activityToCreate = {
          _id: dbName,
          type: activityType,
          name: 'Nouvelle activité',
          description: `Nouvelle description`,
          notes: '',
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
          documentType: 'Activity',
          master: true
        };
        this.logger.log('CREATE', dbName, dbName, 'create activity');
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
          if (this.activitiesList.indexOf(dbName) === -1) {
            this.activitiesList.push(dbName);
          }
          return this.load_activity(dbName);
        })
        .then( () => {
          return this.createSubActivity(dbName);
        })
        .then( (subActivity) => {
          subactivity = subActivity;
          return this.database.getDocument(dbName);
        })
        .then( activity => {
          activity['currentLoaded'] = subactivity._id;
          return this.database.updateDocument(activity);
        })
        .then( () => {
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
          id: activity['_id'],
          name: activity['name'],
          description: activity['description'],
          notes: activity['notes'],
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
            name: 'Nouvelle étape',
            description: 'Il n\'y a aucune description',
            notes: '',
            userList: parent['userList'],
            resourceList: parent['resourceList'],
            applicationList: parent['applicationList'],
            parent: parent['_id'],
            type: 'Sequence',
            subactivityList: [],
            master: parent['master'],
            visible: true,
            blocked: false,
            createdAt: Date.now(),
            dbName: parent['dbName'],
            documentType: 'Activity'
          };
            this.logger.log('CREATE', this.activityLoaded._id, subActivity['_id'], 'create step');
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
          this.sisters.push(subActivity._id)
          //this.activityLoadedChild.push(subActivity._id);
          this.changes.emit({doc: subActivity, type: 'CreateStep'});
          resolve(subActivity);
        })
        .catch(err => {
          console.log(`Error in activity service whith call to createSubActivity :
          ${err}`);
        });
    });
  }

  /**
   * Erease a specified activity
   * @param activityId The Id of the activity to delete
   */
  ereaseActivity(activityId) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId).then(activity => {
        activity['_deleted'] = true;
        return this.database.updateDocument(activity).then( () => {
          return Promise.all(activity['resourceList'].map(resource => {
            return this.database.getDocument(resource).then(res => {
              res['_deleted'] = true;
              return this.database.updateDocument(res);
            });
          }));
        }
      )
          .then( () => {
          return this.database.getDocument(this.user.id);
        })
          .then( user => {
            let index = user['activityList'].indexOf(activityId);
            if (index > -1) {
              user['activityList'].splice(index, 1);
            }
            return this.database.updateDocument(user);
          })
          .then(() => {
            return Promise.all(activity['applicationList'].map(application => {
              return this.database.getDocument(application).then(app => {
                app['_deleted'] = true;
                return this.database.updateDocument(app);
              });
            }));
          })
          .then(() => {
            return Promise.all(activity['subactivityList'].map(subactivity => {
              return this.ereaseActivity(subactivity.stepId);
            }));
          })
          .then(() => {
            activity['_deleted'] = true;
            return this.database.updateDocument(activity);
          });
      });
    });
  }
  /*
  resourceList: parent['resourceList'],
            applicationList: parent['applicationList'],
            parent: parent['_id'],
            type: 'Sequence',
            subactivityList: [],
   */

  /**
   * Delete a specified activity
   * @param activityId The Id of the activity to delete
   */
  deleteActivity(activityId) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId)
    .then(activity => {
      let index = activity['userList'].indexOf(this.user.id);
      if (index > -1) {
        activity['userList'].splice(index, 1);
      }
      if (activity['userList'].length === 0) {
        return this.ereaseActivity(activityId);
      } else {
        return this.database.updateDocument(activity);
      }
    })
    .then( () => {
      return this.database.getDocument(this.user.id);
    })
    .then( user => {
      let index = user['activityList'].indexOf(activityId);
      if (index > -1) {
        user['activityList'].splice(index, 1);
      }
      return this.database.updateDocument(user);
    });
    }
    );
  }



  /**
   * Delete an application
   * @param appId The id of the app to delete
   */
  deleteApp(appId) {
    const apps = this.appsService.applications;
    const index = apps.indexOf(appId);
    if (index > -1) {
      apps.splice(index, 1);
    }
    this.activityEdit(this.activityLoaded._id, 'applicationList', apps).then( () => {
      this.appsService.deleteApp(appId);
    });
  }

  /**
   * Delete an application
   * @param appId The id of the app to delete
   */
  deleteResource(resId) {
    const res = this.resourcesService.resources;
    const index = res.indexOf(resId);
    if (index > -1) {
      res.splice(index, 1);
    }
    this.activityEdit(this.activityLoaded._id, 'resourceList', res).then( () => {
      this.resourcesService.deleteResource(resId);
    });
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
  activityEdit(activityId: string, key: string, value: String, system: boolean = false) {
      this.logger.log('UPDATE', this.activityLoaded._id, this.activityLoaded._id, `activity ${key} updated`, system);
      let duplicateList = [];
      let duplicateTmp = [];
      return new Promise(resolve => {
        return this.database.getDocument(activityId)
          .then(res => {
            res[key] = value;
            if (res['type'] === 'Main') {
              duplicateList = res['duplicateList'];
              return this.database.updateDocument(res).then(() => {
                  return Promise.all(duplicateList.map(duplicate => {
                    return this.activityEdit(duplicate, key, value, system);
                  }));
                }
              );
            } else {
              this.database.getDocument(res['parent']).then(parent => {
                duplicateList = parent['duplicateList'];
                duplicateList.map(duplicate => {
                  duplicateTmp.push(`${activityId}_duplicate_${duplicate.split('_')[3]}`);
                });
                return this.database.updateDocument(res).then(() => {
                    return Promise.all(duplicateTmp.map(duplicate => {
                      return this.activityEdit(duplicate, key, value, system);
                    }));
                  }
                );
              });
            }
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
              return tempThis.addUser(userName, subactivity['stepId']);
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
              return tempThis.removeUser(userName, subactivity['stepId']);
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

  updateActivityMaster(change) {
    if (change.doc.master) {
      this.getActivityDuplicate(change.doc.parent).then((duplicates: Array<any>) => {
        Promise.all(duplicates.map( duplicate => {
            const duplicateName = duplicate.split('_', 2);
            const duplicateId = `${change.doc._id}_duplicate_${duplicateName}`;
            return this.updateActivityDuplicate(change.doc, duplicateId);
          })
        );
      });
    }
  }

  updateActivityDuplicate(template, duplicateId) {
    return new Promise(resolve => {
      return this.database.getDocument(duplicateId).then(duplicate => {
          duplicate['name'] = template.name;
          duplicate['description'] = template.description;
          duplicate['notes'] = template.notes;
          duplicate['userList'] = template.userList;
          duplicate['subactivityList'] = template.subactivityList;
          duplicate['resourceList'] = template.resourceList;
          duplicate['visible'] = template.visible;
          duplicate['blocked'] = template.blocked;
          duplicate['applicationList'] = template.applicationList;
          // Subactivities, resources & apps => Change with Id
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
                subactivities.push({
                  'stepId': `${subactivity['stepId']}_duplicate_${guid}`,
                  'visible': true,
                  'blocked': false
                });
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
            resolve(res);
          });
        })
        .then( () => {
          return Promise.all( activity['userList'].map(user => {
            return this.database.getDocument(user).then( userDoc => {
              //userDoc['activityList'].push(newDb);
              return this.database.updateDocument(userDoc);
              }
            );
          }));
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
    return new Promise(cast => {
      return this.database.getDocument(activityId).then(activity => {
        cast(activity['duplicateList']);
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
          if (state) {
            this.logger.log('UPDATE', this.activityLoaded._id, activityId, 'show step');
          } else {
            this.logger.log('UPDATE', this.activityLoaded._id, activityId, 'hide step');
          }
          resolve(doc);
        });
    });
  }
}
