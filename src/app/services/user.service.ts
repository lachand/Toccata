import {EventEmitter, Injectable, Output} from '@angular/core';
import {User} from '../../models/user.model';
import * as config from 'variables';
import PouchDB from 'pouchdb';

@Injectable()
export class UserService {
  loggedIn = false;
  db: any;
  db_remote: any;
  user: User;
  name: any;
  id: any;
  avatar: any;
  fonction: any;
  participants: any;
  allUsers: Array<any>;

  @Output()
  change = new EventEmitter();

  constructor() {
    this.loggedIn = false;
    this.db = new PouchDB(config.HOST + ':' + config.PORT + '/users');
    this.db_remote = new PouchDB(config.HOST + ':' + config.PORT + '/users');
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.db.sync(this.db_remote, options);
    this.getAllusers();
  }

  public login(username, password) {
    return new Promise((resolve, reject) => {
      this.db.login(username, password, function (err, response) {
        if (err) {
          if (err.name === 'unauthorized') {
            console.log('name or password incorrect');
            reject(err);
          } else {
            console.log(err);
            reject(err);
          }
        }
      }).then((result) => {
        this.loggedIn = result['ok'];
        console.log('logged');
        this.db.getUser(username, function (err, response) {
          if (err) {
            if (err.name === 'not_found') {
              console.log('user not found');
              reject(err);
            } else {
              console.log(err);
              reject(err);
            }
          }}).then( (res) => {
          this.name = res['name'];
          this.id = res['_id'];
          this.avatar = res['avatar'];
          this.fonction = res['fonction'];
          resolve(this.loggedIn);
          });
          }
        ).catch(console.log.bind(console));
        }
      );
  }

  getName(userId) {
    return new Promise((resolve, reject) => {
      this.db.getUser(userId, function (err, response) {
        if (err) {
          if (err.name === 'not_found') {
            console.log('user not found');
            reject(err);
          } else {
            console.log(err);
            reject(err);
          }
        }}).then( (res) => {
          resolve(res['name']);
        }
      ).catch(console.log.bind(console));
    });
  }

  getActivities() {
    return new Promise((resolve, reject) => {
      this.db.getUser(this.name, function (err, response) {
        if (err) {
          if (err.name === 'not_found') {
            console.log('user not found');
            reject(err);
          } else {
            console.log(err);
            reject(err);
          }
        }}).then( (res) => {
          resolve(res['activites']);
        }
      ).catch(console.log.bind(console));
    });
  }

  getAllusers() {
    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true,
        attachments: true
      }).then(result => {
        this.allUsers = [];
        const docs = result.rows.map((row) => {
          if (row.id !== '_design/byActivity') {
            this.allUsers.push(row.doc);
          }
        });
        resolve(this.allUsers);
      }).catch(console.log.bind(console));
      this.db.changes({live: true, since: 'now', include_docs: true}).once('change', (change) => {
        this.handleChangeAllUsers(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  getParticipants(activityId) {
    return new Promise(resolve => {
      this.db.query('byActivity/by-activity',
        { startkey: activityId, endkey: activityId}).then(result => {
        this.participants = [];
        const docs = result.rows.map((row) => {
          this.participants.push(row.value);
        });
        resolve(this.participants);
      }).catch(console.log.bind(console));
      this.db.changes({live: true, since: 'now', include_docs: true}).once('change', (change) => {
        this.handleChangeParticipants(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  remove_activity(activityId) {
    for (let user of this.allUsers){
      user.activites.splice(user.activites.indexOf(activityId), 1);
    }
    this.db.bulkDocs(this.allUsers);
  }

  addActivity(activityId, userId) {
    this.db.get(userId).then( userSelected => {
      console.log(userSelected);
      userSelected.activites.push(activityId);
      this.db.put(userSelected);
    });
  }

  private handleChangeParticipants(change) {
    let changedDoc = null;
    let changedIndex = null;
    if (!change.deleted) {
        this.participants.forEach((doc, index) => {
          if (doc._id === change.doc._id) {
            changedDoc = doc;
            changedIndex = index;
          }
        });
        if (changedDoc) {
          // = delete des participants de l'activité chargée
          this.participants.splice(changedIndex, 1);
          this.change.emit({changeType: 'delete', value: changedIndex});
        } else {
          this.participants.push(change.doc);
          this.change.emit({changeType: 'create', value: change.doc});
        }
    } else {
        this.participants.splice(changedIndex, 1);
        this.change.emit({changeType: 'delete', value: changedIndex});
    }
  }

  private handleChangeAllUsers(change) {
    let changedDoc = null;
    let changedIndex = null;
    if (!change.deleted) {
      this.allUsers.forEach((doc, index) => {
        if (doc._id === change.doc._id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });
      if (changedDoc) {
        this.allUsers[changedIndex] = change.doc;
        this.change.emit({changeType: 'modification', value: change.doc});
      } else {
        this.allUsers.push(change.doc);
        this.change.emit({changeType: 'create', value: change.doc});
      }
    } else {
      this.allUsers.splice(changedIndex, 1);
      this.change.emit({changeType: 'delete', value: changedIndex});
    }
  }

  logout() {
    this.loggedIn = false;
    this.name = null;
    this.id = null;
    this.avatar = null;
    this.fonction = null;
    this.participants = null;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
