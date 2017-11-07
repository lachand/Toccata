import {DatabaseService} from './database.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ResourcesService {
  resources: any;

  /**
   * Get informations about a specific resource
   * @param resourceId
   */AppsService

  constructor(public database: DatabaseService) {
    this.resources = {};
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

  getResourceInfos(resourceId: any) {
    return new Promise(resolve => {
      return this.database.getDocument(resourceId).then(resource => {
        resolve({
          name: resource['name'],
          type: resource['type']
        });
      }).catch(err => {
        console.log(`Error in resource service whith call to getResourceInfos : 
          ${err}`);
      });
    });
  }

  deleteResource(resource) {
    return new Promise(resolve => resolve(true));
  }

  getResourceData(resourceId: any, attachmentId: any) {
    return new Promise(resolve => resolve(true));
  }
}
