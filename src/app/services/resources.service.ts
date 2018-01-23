import {DatabaseService} from './database.service';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {LoggerService} from './logger.service';
import {ActivityService} from "app/services/activity.service";

@Injectable()
export class ResourcesService {
  resources: any;

  @Output()
  changes = new EventEmitter();

  /**
   * Get informations about a specific resource
   * @param resourceId
   */AppsService

  constructor(public database: DatabaseService, private logger: LoggerService) {
    this.resources = {};
    this.database.changes.subscribe(
      (change) => {
        console.log(`there is a change ${change.type}`);
        if (change.type === 'Resource') {
          this.changes.emit({doc: change.doc, type: change.doc.type});
        }
      }
    );
  }

  /**
   * Get all resources of the current activity
   * @param activityId
   * @returns {Promise<any>}
   */
  public getResources(activityId) {
    return new Promise(resolve => {
      return this.database.getDocument(activityId)
        .then(activity => {
          this.resources = activity['resourceList'];
          resolve(this.resources);
        });
    });
  }

  /**
   * Create a new resource and upload it
   * @param resource
   * @param activityId
   */
  createResource(resource, activityId) {
    return new Promise(resolve => {
      let activity;
      let resourceToAdd;
      return this.database.getDocument(activityId).then(res => {
        activity = res
        if (resource.type === 'url') {
          resourceToAdd = {
            _id: `resource_${resource.name}`,
            name: resource.name,
            activity: activityId,
            documentType: 'Resource',
            type: resource.type,
            url: resource.value,
            dbName: activity['dbName']
          };
        } else {
          resourceToAdd = {
            _id: `resource_${resource.name}`,
            name: resource.name,
            activity: activityId,
            documentType: 'Resource',
            type: resource.type,
            dbName: activity['dbName'],
            _attachments: {
              filename: {
                content_type: resource.type,
                data: resource
              }
            }
          };
        }
        return this.database.addDocument(resourceToAdd);
      })
        .then(res => {
          activity['resourceList'].push(`resource_${resource.name}`);
          return this.database.updateDocument(activity);
        })
        .then(() => resolve(resourceToAdd))
        .catch(err => {
          console.log(`Error in resource service whith call to createResource : 
          ${err}`);
        });
    });
  }

  /**
   * Get informations about a specific resource
   * @param resourceId
   */
  getResourceInfos(resourceId: any) {
    return new Promise(resolve => {
      return this.database.getDocument(resourceId).then(resource => {
        if (resource['type'] === 'url'){
          resolve({
            name: resource['name'],
            id: resource['_id'],
            type: resource['type'],
            status: resource['status'],
            url: resource['url']
          });
        } else {
          resolve({
            name: resource['name'],
            id: resource['_id'],
            type: resource['type'],
            status: resource['status']
          });
        }
      }).catch(err => {
        console.log(`Error in apps service whith call to getResourceInfos : 
          ${err}`);
      });
    });
  }

  deleteResource(resource) {
    return new Promise(resolve => {
      return this.database.getDocument(resource).then(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  getResource(resource) {
    return new Promise(resolve => {
      return this.database.getDocument(resource).then(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  getResourceData(resourceId: any, attachmentId: any) {
    return new Promise(resolve => {
      console.log(resourceId, attachmentId);
      return this.database.db.getAttachment(resourceId, attachmentId).then(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  /**
   * Open a specified resource
   * @param resourceId
   * @returns {Promise<any>}
   */
  openResource(resourceId: any) {
    return new Promise(resolve => {
      return this.database.getDocument(resourceId).then(resource => {
          resource['status'] = 'loaded';
          return this.database.updateDocument(resource);
        }
      ).then(() => {
        return this.getResourceInfos(resourceId);
      })
        .then(resourceInfos => {
          resolve(resourceInfos);
        })
        .catch(function (err) {
          console.log(`Error in apps service whith call to openResource : 
          ${err}`);
        });
    });
  }

  /**
   * Close a specified resource
   * @param resourceId
   * @returns {Promise<any>}
   */
  closeResource(resourceId: any) {
    return new Promise(resolve => {
      return this.database.getDocument(resourceId).then(resource => {
          resource['status'] = 'unloaded';
          return this.database.updateDocument(resource);
        }
      ).then(() => {
        return this.getResourceInfos(resourceId);
      })
        .then(resourceInfos => {
          resolve(resourceInfos);
        })
        .catch(function (err) {
          console.log(`Error in apps service whith call to closeResource : 
          ${err}`);
        });
    });
  }
}

