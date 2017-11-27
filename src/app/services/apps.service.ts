import {EventEmitter, Inject, Injectable, Output} from '@angular/core';
import {Http} from '@angular/http';
import {DatabaseService} from './database.service';

@Injectable()
export class AppsService {
  applications: any;

  @Output()
  changes = new EventEmitter();

  constructor(@Inject(Http) public http: Http, public databaseService: DatabaseService) {
    this.databaseService.changes.subscribe(
      (change) => {
        console.log(`there is a change ${change.type}`);
        if (change.type === 'Application') {
          this.changes.emit({doc: change.doc, type: change.doc.type});
        }
      }
    );
  }

  /**
   * Get all applications of the current activity
   * @param activityId
   * @returns {Promise<any>}
   */
  public getApplications(activityId) {
    return new Promise(resolve => {
      return this.databaseService.getDocument(activityId)
        .then(activity => {
          this.applications = activity['applicationList'];
          console.log(this.applications);
          resolve(this.applications);
        });
    });
  }

  /**
   * Create an application to add to the current activity
   * @param app
   * @param dbName
   * @returns {Promise<any>}
   */
  public createApp(app, activityId, dbName) {
    console.log('debug : ', app, dbName);
    const guid = this.databaseService.guid();
    const application = {
      _id: `application_${app.provider}_${guid}`,
      name: app.name,
      documentType: 'Application',
      type: app.type,
      status: 'unloaded',
      url: '',
      dbName: dbName,
    };

    if (app.type === 'Chronomètre') {
      application['running'] = false;
      application['initialTime'] = app.options.time;
      application['timeLeft'] = app.options.time;
      application['startedAt'] = '';
    }

    if (app.provider === 'Feuille de calcul') {
      application.url = `https://framacalc.org/${guid}`;
    } else if (app.provider === 'Editeur de texte') {
      application.url = `https://annuel2.framapad.org/p/${guid}`;
    }

    return new Promise(resolve => {
      return this.databaseService.getDocument(activityId).then(activity => {
        activity['applicationList'].push(application._id);
        return this.databaseService.addDocument(activity);
      })
        .then(() => {
          return this.databaseService.addDocument(application).then(res => {
            resolve(res);
          });
        }).catch(err => {
          console.log(`Error in apps service whith call to createApp:
          ${err}`);
        });
    });
  }

  /**
   * Get informations about a specific application
   * @param applicationId
   */
  getApplicationInfos(applicationId: any) {
    console.log(applicationId);
    return new Promise(resolve => {
      return this.databaseService.getDocument(applicationId).then(application => {
        resolve({
          name: application['name'],
          id: application['_id'],
          type: application['type'],
          status: application['status']
        });
      }).catch(err => {
        console.log(`Error in apps service whith call to getApplicationInfos : 
          ${err}`);
      });
    });
  }

  public unloadApp(appId) {
    return 0;
  }

  public loadApp(appId) {
    return 0;
  }

  public getApp(appId) {
    return 0;
  }

  public deleteApp(appId) {
    return 0;
  }

  remove_activity(activityId) {
    return 0;
  }

  duplicateAppsFromActivity(inputActivity, outputActivity) {
    return 0;
  }

  logout() {
    this.applications = [];
  }

  /**
   * Get ressources of an application
   * @param appId
   * @returns {Promise<any>}
   */
  getRessources(appId) {
    return new Promise(resolve => {
      this.databaseService.db.find({
        selector: {
          'documentType': 'Ressource application',
          'application': appId
        }
      }).then(function (result) {
        resolve(result);
      }).catch(function (err) {
        console.log(`Error in apps service whith call to getRessources : 
          ${err}`);
      });
    });
  }

  /**
   * Switch the status of the application
   * @param applicationId
   */
  switchApplicationStatus(applicationId: any) {
    return new Promise(resolve => {
      return this.databaseService.getDocument(applicationId).then(application => {
          let status = application['status'];
          if (status === 'unloaded') {
            status = 'loaded';
          } else {
            status = 'unloaded';
          }
          application['status'] = status;
          return this.databaseService.updateDocument(application);
        }
      ).then(() => {
        return this.getApplicationInfos(applicationId);
      })
        .then(appInfos => {
          resolve(appInfos);
        })
        .catch(function (err) {
          console.log(`Error in apps service whith call to getRessources : 
          ${err}`);
        });
    });
  }

  /**
   * Get a specified application
   * @param appId
   * @returns {Promise<any>}
   */
  getApplication(appId: any) {
    console.log(appId);
    return new Promise(resolve => {
      return this.databaseService.getDocument(appId).then(app => {
        resolve(app);
      })
        .catch(function (err) {
          console.log(`Error in apps service whith call to getApplication : 
          ${err}`);
        });
    });
  }

  /**
   * update a specified application
   * @param app
   * @returns {Promise<any>}
   */
  updateApplication(app: any) {
    return new Promise(resolve => {
      this.databaseService.updateDocument(app).then(res => {
        resolve(res);
      })
        .catch(function (err) {
          console.log(`Error in apps service whith call to getApplication : 
          ${err}`);
        });
    });
  }

  closeApplication(appId: any) {
    return new Promise(resolve => {
      return this.databaseService.getDocument(appId).then(application => {
          application['status'] = 'unloaded';
          return this.databaseService.updateDocument(application);
        }
      ).then(() => {
        return this.getApplicationInfos(appId);
      })
        .then(appInfos => {
          resolve(appInfos);
        })
        .catch(function (err) {
          console.log(`Error in apps service whith call to closeApplication : 
          ${err}`);
        });
    });
  }

  openApplication(appId: any) {
    return new Promise(resolve => {
      return this.databaseService.getDocument(appId).then(application => {
          application['status'] = 'loaded';
          return this.databaseService.updateDocument(application);
        }
      ).then(() => {
        return this.getApplicationInfos(appId);
      })
        .then(appInfos => {
          resolve(appInfos);
        })
        .catch(function (err) {
          console.log(`Error in apps service whith call to openApplication : 
          ${err}`);
        });
    });
  }
}
