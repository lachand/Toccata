import {EventEmitter, Injectable, Output} from '@angular/core';
import {DatabaseService} from './database.service';

@Injectable()
export class UserService {
  loggedIn = false;
  user: any;
  name: any;
  id: any;
  avatar: any;
  fonction: any;
  participants: Array<any> = null;
  allUsers: Array<any>;

  @Output()
  change = new EventEmitter();

  constructor(public database: DatabaseService) {
    this.loggedIn = false;
  }

  /**
   * Create new user in database
   * @param {string} username
   * @param {string} password
   * @returns {Promise<any>}
   */
  signup(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.database.dbRemote.signup(username, password, function (err) {
        if (err) {
          if (err.name === 'conflict') {
            reject(err);
          } else if (err.name === 'forbidden') {
            reject(err);
          } else {
          }
        }
      }).then(userCreated => {
        resolve(userCreated);
      }).catch(err => {
        console.log(`Error in user service whith call to signup : 
        ${err}`);
        reject(err);
      });
    });
  }

  /**
   * Login an user
   * @param username
   * @param password
   * @returns {Promise<any>}
   */
  public login(username, password) {
    return new Promise((resolve, reject) => {
        this.database.dbRemote.login(username, password, function (err, response) {
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
          return this.database.addDatabase(`user_${username}`);
        })
          .then(() => {
            return this.database.getDocument(username);
          })
          .then((res) => {
            console.log(res);
            this.name = res['name'];
            this.id = res['_id'];
            this.avatar = res['avatar'];
            this.fonction = res['fonct'];
            resolve(this.loggedIn);
          });
      }
    ).catch(function (err) {
      console.log(err);
    });
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

  /**
   * Create an user
   * @param {string} username
   * @param {string} name
   * @param {string} surname
   * @param {string} avatar
   * @param isTeacher
   * @returns {Promise<any>}
   */
  createUser(username: string, name: string, surname: string, avatar: string, isTeacher: any) {
    return new Promise(resolve => {
      const fonct = isTeacher ? 'Enseignant' : 'Eleve';
      const document = {
        _id: username,
        name: name,
        surname: surname,
        avatar: avatar,
        fonct: fonct,
        activityList: [],
        documentType: 'user',
        dbName: `user_${username}`
      };

      return this.database.addDatabase(document.dbName)
        .then(databaseCreated => {
          return this.database.addDocument(document);
        })
        .then(res => {
          console.log(res);
          resolve(res);
        })
        .catch(err => {
          console.log(`Error in user service whith call to createUser : 
        ${err}`);
        });
    });
  }

  /**
   * Get all available users
   * @returns {Promise<any>}
   */
  getAllUsers() {
    return new Promise(resolve => {
      return this.database.getDocument('userList').then(res => {
        this.allUsers = res['userList'];
        resolve(this.allUsers);
      })
        .catch(err => {
          console.log(`Error in user service whith call to getAllUsers : 
        ${err}`);
        });
    });
  }

  /**
   * Get participants of a specific activity
   * @param activityId
   * @returns {Promise<any>}
   */
  getParticipants(activityId) {
    return new Promise(resolve => {
      const tempThis = this;
      return this.database.getDocument(activityId).then(activity => {
          this.participants = activity['userList'];
          return Promise.all(this.participants.map(function (user) {
            return tempThis.database.addDatabase(`user_${user}`);
          }));
        }
      )
        .then(() => {
          resolve(this.participants);
        })
        .catch(err => {
          console.log(`Error in user service whith call to getParticipants : 
        ${err}`);
        });
    });
  }

  /**
   * Get information about a specific participant
   * @param participantId
   */
  getParticipantInfos(participantId: any) {
    return new Promise(resolve => {
      console.log(participantId);
      return this.database.getDocument(participantId)
        .then(participant => {
          resolve(participant);
        })
        .catch(err => {
          console.log(`Error in user service whith call to getParticipantInfos : 
        ${err}`);
        });
    });
  }

  /**
   * Add an activity to a specific user
   * @param activityId
   */
  addActivity(activityId, userName) {
    return new Promise(resolve => {
      return this.database.addDatabase(`user_${userName}`).then(() => {
        return this.database.getDocument(userName)
          .then(user => {
            user['activityList'].push(activityId);
            return this.database.addDocument(user);
          })
          .then(resUser => {
            resolve(resUser);
          })
          .catch(err => {
            console.log(`Error in user service whith call to addActivity : 
        ${err}`);
          });
      });
    })
      ;
  }

  /**
   * Remove an activity to a specific user
   * @param activityId
   */
  removeActivity(activityId, userName) {
    return new Promise(resolve => {
      console.log(`going to add a database: user_${userName}`);
      return this.database.addDatabase(`user_${userName}`).then(() => {
        console.log('database added');
        return this.database.getDocument(userName).then(user => {
          console.log('get user : ', userName);
          console.log(user['activityList'].indexOf(activityId));
          user['activityList'].splice(user['activityList'].indexOf(activityId), 1);
          return this.database.addDocument(user);
        })
          .then(resUser => {
            resolve(resUser);
          });
      })
        .catch(err => {
          console.log(`Error in user service whith call to addActivity : 
        ${err}`);
        });
    });
  }
}
