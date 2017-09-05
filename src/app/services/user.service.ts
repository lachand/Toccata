import {EventEmitter, Injectable, Output} from '@angular/core';
import {User} from '../../models/user.model';
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
    this.db = new PouchDB('http://127.0.0.1:5984/users');
    this.db_remote = 'http://127.0.0.1:5984/users';
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    this.getAllusers();
  }

  login(username, password) {
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
          }
        );
        }
      );
    });
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
      );
    });
  }

  getUsername() {
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
        resolve(res['name']);
      }
    );
  });
  }

  getAvatar() {
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
      resolve(res['avatar']);
}
);
});
}

  getFonction() {
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
          resolve(res['fonction']);
        }
      );
    });
  }

  getId() {
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
          resolve(res['_id']);
        }
      );
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
      );
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
      });
      this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
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
      });
      this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
        this.handleChangeParticipants(change);
      });
    }).catch((error) => {
      console.log(error);
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

  duplicateUsersFromActivity(inputActivity, outputActivity) {
    return new Promise(resolve => {
      this.db.query('byActivity/by-activity',
        { startkey: inputActivity, endkey: inputActivity}).then(result => {
        let users = [];
        const docs = result.rows.map((row) => {
          users.push(row.value);
        });
        for (let user of users) {
          user.activites.push(outputActivity);
        }
        this.db.bulkDocs(users).then( res => { resolve(res); } );
      });
    });
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}