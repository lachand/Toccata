import {EventEmitter, Inject, Injectable, Output} from '@angular/core';
import {Http} from '@angular/http';
import {DatabaseService} from './database.service';

@Injectable()
export class AppsService {
  applications: any;

  @Output()
  change = new EventEmitter();

  constructor(@Inject(Http) public http: Http, public databaseService: DatabaseService) {
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
  public createApp(app, dbName) {
    console.log('debug : ', app, dbName);
    const guid = this.databaseService.guid();
    const application = {
      _id: `application_${app.provider}_${guid}`,
      name: app.provider,
      documentType: 'Application',
      type: app.type,
      status: 'unloaded',
      url: '',
      dbName: dbName,
    };

    if (app.provider === 'Feuille de calcul') {
      application.url = `https://framacalc.org/${guid}`;
    } else if (app.provider === 'Editeur de texte') {
      application.url = `https://annuel2.framapad.org/p/${guid}`;
    }

    return new Promise(resolve => {
      return this.databaseService.getDocument(dbName).then(activity => {
        activity['applicationList'].push(application._id);
        return this.databaseService.addDocument(activity);
      })
        .then(() => {
          return this.databaseService.addDocument(application).then(res => {
            resolve(res);
          })
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
        console.log("debug : ", application);
        resolve({
          name: application['name'],
          id: application['_id']
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
}
