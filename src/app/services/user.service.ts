import { Injectable} from '@angular/core';
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

  constructor() {
    this.loggedIn = false;
    this.db = new PouchDB('http://127.0.0.1:5984/users');
    this.db_remote = 'http://127.0.0.1:5984/users';
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
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
        //this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
