import PouchDB from 'pouchdb';
import * as config from 'variables';
import {EventEmitter, Output} from '@angular/core';

export class ResourcesService {
  resourcesDb: any;
  resourcesDbRemote: any;
  resources: any;
  tempChanges: Array<any>;
  resourcesSync: any;

  @Output()
  change = new EventEmitter();

  constructor() {
    //this.messagesDb = new PouchDB('messages');
    this.tempChanges = [];
    this.resources = {};
    this.resourcesDb = new PouchDB('resources');
    this.resourcesDbRemote = new PouchDB(config.HOST + config.PORT + '/resources');
    const options = {
      live: true,
      retry: true,
      continuous: true,
      timeout: false,
      heartbeat: false,
      ajax: {timeout: 60000}
    };
    this.resourcesSync = this.resourcesDb.sync(this.resourcesDbRemote, options);
    this.resourcesDb.changes({
      since: 'now',
      live: true,
      include_docs: true }).on('change', change => {
      console.log(change);
      this.handleChange(change);
    }).on('paused', function (info) {
      // replication was paused, usually because of a lost connection
    }).on('active', function (info) {
      // replication was resumed
    }).on('error', function (err) {
      // totally unhandled error (shouldn't happen)
    });

  }

  /**
   getResources(app) {
    const name = app.id;
    if (this.resources[name] && this.resources[name].length > 0) {
      return Promise.resolve(this.resources[name]);
    }
    return new Promise(resolve => {
      this.resourcesDb.query('byApplication/by-application',
        { startkey: name, endkey: name}).then(result => {
          this.resources[name] = [];
          const docs = result.rows.map((row) => {
            this.resources[name].push(row.value);
          });
        resolve(this.resources[name]);
      }).catch(console.log.bind(console));
      this.resourcesDb.changes({live: true, since: 'now', include_docs: true}).once('change', (change) => {
        //this.handleChange(change);
      });
    }).catch((error) => {
      console.log(error);
    });
  }
   **/

  public getResources(activityId) {
    const name = activityId;
    if (this.resources[name] && this.resources[name].length > 0) {
      return Promise.resolve(this.resources[name]);
    }
    return new Promise(resolve => {
      this.resourcesDb.query('byActivity/by-activity',
        {startkey: name, endkey: name}).then(result => {
        this.resources[name] = [];
        const docs = result.rows.map((row) => {
          this.resources[name].push(row.value);
        });
        console.log(this.resources);
        resolve(this.resources[name]);
      }).catch(console.log.bind(console));
    }).catch((error) => {
      console.log(error);
    });
  }

  createResource(resource, activityId) {
    const resourceToAdd = {
      'name': resource.name,
      'activity': activityId,
      'type': resource.type,
      '_attachments': {
        'filename': {
          'content_type': resource.type,
          'data': resource
        }
      }
    };
    this.resourcesDb.post(resourceToAdd).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  deleteResource(resource) {
    this.resourcesDb.remove(resource).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  getIndexOf(document, array) {
    let i = 0;
    for (const element of array) {
      if (element._id === document._id) {
        return i;
      }
      i = i + 1;
    }
    return -1;
  }

  private handleChange(change) {
    const document = change.doc;
    if (!document._deleted) {
      let changedDoc = null;
      let changedIndex = null;
      console.log('changed doc : ', this.resources, this.resources[document.activity]);
      this.resources[document.activity].forEach((doc, index) => {
        if (doc._id === document._id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });
      console.log('changed doc bis : ', changedDoc);
      if (changedDoc) {
        console.log(this.resources, this.resources[document.activity]);
        this.resources[document.activity][changedIndex] = document;
        this.change.emit({changeType: 'modification', value: document});
      } else {
        console.log('creation : ');
        this.resources[document.activity].push(document);
        this.change.emit({changeType: 'create', value: document});
        console.log('resources : ', this.resources, this.resources[document.activity]);
      }
    } else {
      for (const activity in this.resources) {
        this.resources[activity].splice(this.getIndexOf(document, this.resources[activity]), 1);
        /** Tricky way **/
        this.change.emit({changeType: 'delete', value: change});
        console.log(this.resources);
      }
    }
  }

  getResourceData(resourceId: any, attachmentId: any) {
    return this.resourcesDb.getAttachment(resourceId, attachmentId);
  }
}
