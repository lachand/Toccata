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
   * @param {string} username The username of the user
   * @param {string} password The password of the user
   * @returns {Promise<any>} The confirmation of creation
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
   * @param username The username to connect
   * @param password The password of the user
   * @returns {Promise<any>} The confirmation of connection
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
            this.name = res['name'];
            this.id = res['_id'];
            this.avatar = res['avatar'];
            this.fonction = res['fonct'];
            resolve(this.loggedIn);
          })
          .catch(function (err) {
            resolve(err);
          });
      }
    );
  }

  /**
   * Disconnect an user
   */
  logout() {
    this.loggedIn = false;
    this.name = null;
    this.id = null;
    this.avatar = null;
    this.fonction = null;
    this.participants = null;
  }

  /**
   * Check if an user is connected
   * @returns {boolean} Whether the user is connected (true) or not (false)
   */
  isLoggedIn() {
    return this.loggedIn;
  }

  /**
   * Create an user
   * @param {string} username The username of the user
   * @param {string} name The name of the user
   * @param {string} surname The surname of the user
   * @param {string} avatar The avatar of the user
   * @param isTeacher Whether the user is a teacher or not
   * @returns {Promise<any>} The created user
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
          return this.database.addDocument(document); })
        .then(res => {
          return this.database.getDocument('user_list');
        })
        .then(user_list => {
          console.log(user_list);
          if (user_list['userList'].indexOf(document._id) === -1) {
            user_list['userList'].push(document._id);
          }
          return this.database.updateDocument(user_list);
        } )
        .then( () => {resolve (document._id); })
        .catch(err => {
          console.log(`Error in user service whith call to createUser : 
        ${err}`);
        });
    });
  }

  /**
   * Get all available users
   * @returns {Promise<any>} The list of users
   */
  getAllUsers() {
    return new Promise(resolve => {
      return this.database.getDocument('user_list').then(res => {
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
   * @param activityId The activity
   * @returns {Promise<any>} The list of all participants of the activity
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
   * Delete a specified user
   * @param userId The user to delete
   */
  deleteUser(userId) {
    return new Promise(resolve => {
      console.log("begin deletion");
      return this.database.removeDocument(userId).then( () => {
        console.log("doc deleted");
        return this.database.getDocument('user_list');
      })
        .then( res => {
          console.log("user list loaded");
          res['userList'].splice( res['userList'].indexOf(userId), 1 );
          return this.database.updateDocument(res);
        })
        .then( deletion => {
          resolve(deletion);
        });
    });

  }

  /**
   * Get information about a specific participant
   * @param participantId The participant Id
   */
  getParticipantInfos(participantId: any) {
    return new Promise(resolve => {
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
   * @param activityId The activity Id to add
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
   * @param activityId The activity Id to remove
   */
  removeActivity(activityId, userName) {
    return new Promise(resolve => {
      return this.database.addDatabase(`user_${userName}`).then(() => {
        return this.database.getDocument(userName).then(user => {
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
