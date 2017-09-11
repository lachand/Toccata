import PouchDB from 'pouchdb';
import * as config from 'variables';
import { Message } from '../../models/message.model';
import {EventEmitter, Output} from '@angular/core';

export class MessagesService {
  messages_db: any;
  messages_db_remote: any;
  messages: Array<Message>;

  @Output()
  change = new EventEmitter();

  constructor() {
    //this.messages_db = new PouchDB('messages');
    this.messages_db = new PouchDB(config.HOST + ':' + config.PORT + '/messages');
    this.messages_db_remote = config.HOST + ':' + config.PORT + '/messages';
    const options = {
      live: true,
      retry: true,
      continuous: true
    };

  }
  getMessages() {
    if (this.messages) {
      return Promise.resolve(this.messages);
    }
    return new Promise(resolve => {
      this.messages_db.allDocs({
        include_docs: true
      }).then((result) => {
        this.messages = [];
        const docs = result.rows.map((row) => {
          this.messages.push(row.doc);
        });
        resolve(this.messages);
        this.messages_db.changes({live: true, since: 'now', include_docs: true}).once('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  createMessage(message: Message) {
    this.messages_db.post(message).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  updateMessage(message: Message) {

  }

  deleteMessage(message: Message) {
    this.messages_db.remove(message).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  handleChange(change) {
    let changedDoc = null;
    let changedIndex = null;
    this.messages.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });
    if (change.deleted) {
      //delete
      this.messages.splice(changedIndex, 1);
      this.change.emit({changeType: 'delete', value: changedIndex});
    }
    else {
      //modification
      if (changedDoc) {
        this.messages[changedIndex] = change.doc;
        this.change.emit({changeType: 'modification', value: change.doc});
      }
      //new
      else {
        this.messages.push(change.doc);
        this.change.emit({changeType: 'create', value: change.doc});
      }
    }
  }
}
