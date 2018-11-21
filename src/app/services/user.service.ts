import { EventEmitter, Injectable, Output } from "@angular/core";
import { DatabaseService } from "./database.service";
import { Md5 } from "ts-md5";

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
  avatarUrl: String;

  @Output()
  change = new EventEmitter();

  /**
   * Construct the user service
   * @param database The database service for document updates
   */
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
      resolve(username);
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
      return this.database
        .getDocument(username)
        .then(user => {
          const md5 = new Md5();
          const hashedPassword = md5.appendStr(password).end();
          if (true) {
            //  console.log('ok');
            //if (user['hashedPassword'] === hashedPassword) {
            this.loggedIn = true;
            this.id = username;
            return this.database.getDocument(username);
          }
        })
        .then(res => {
          this.name = res["name"];
          this.id = res["_id"];
          this.avatar = res["avatar"];
          this.fonction = res["fonct"];

          Promise.all(
            res["activityList"].map(activity => {
              return this.database.addDatabase(activity);
            })
          ).then(() => {
            let docNumber = 0;
            this.database.dbRemote.query("my_index/by_dbName").then(res => {
              for (const doc of res.rows) {
                for (const database of this.database.dbList) {
                  if (database === doc.key) {
                    docNumber++;
                  }
                }
              }
              this.database.dbSize = docNumber;
              resolve(true);
            });
          });
        });
    });
  }

  /**
   * Return the url of an user avatar
   * @param participant The user Id to obtain avatar
   */
  getUserAvatar(participant) {
    return new Promise(resolve => {
      return this.database.getDocument(participant).then(res => {
        resolve(res["avatar"]);
      });
    });
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
  createUser(
    username: string,
    name: string,
    surname: string,
    password: string,
    avatar: string,
    isTeacher: any
  ) {
    const md5 = new Md5();
    const hashedPassword = md5.appendStr(password).end();
    return new Promise(resolve => {
      const fonct = isTeacher ? "Enseignant" : "Eleve";
      const document = {
        _id: username,
        name,
        surname,
        hashedPassword,
        avatar,
        fonct,
        activityList: [],
        documentType: "user",
        dbName: `user_${username}`
      };

      return this.database
        .addDatabase(document.dbName)
        .then(databaseCreated => {
          return this.database.addDocument(document);
        })
        .then(res => {
          return this.database.getDocument("user_list");
        })
        .then(user_list => {
          if (user_list["userList"].indexOf(document._id) === -1) {
            user_list["userList"].push(document._id);
          }
          return this.database.updateDocument(user_list);
        })
        .then(() => {
          resolve(document._id);
        })
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
      return this.database
        .getDocument("user_list")
        .then(res => {
          this.allUsers = res["userList"];
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
      return this.database
        .getDocument(activityId)
        .then(activity => {
          this.participants = activity["userList"];
          return Promise.all(
            this.participants.map(function(user) {
              return tempThis.database.addDatabase(`user_${user}`);
            })
          );
        })
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
      return this.database
        .removeDocument(userId)
        .then(() => {
          return this.database.getDocument("user_list");
        })
        .then(res => {
          res["userList"].splice(res["userList"].indexOf(userId), 1);
          return this.database.updateDocument(res);
        })
        .then(deletion => {
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
      return this.database
        .getDocument(participantId)
        .then(participant => {
          this.getUserAvatar(participantId).then(url => {
            participant["url"] = url;
            resolve(participant);
          });
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
        return this.database
          .getDocument(userName)
          .then(user => {
            user["activityList"].push(activityId);
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
    });
  }

  /**
   * Remove an activity to a specific user
   * @param activityId The activity Id to remove
   */
  removeActivity(activityId, userName) {
    return new Promise(resolve => {
      return this.database
        .addDatabase(`user_${userName}`)
        .then(() => {
          return this.database
            .getDocument(userName)
            .then(user => {
              user["activityList"].splice(
                user["activityList"].indexOf(activityId),
                1
              );
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
