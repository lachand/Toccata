import PouchDB from 'pouchdb';
import { Message } from '../../models/message.model';
import {EventEmitter, Output} from '@angular/core';

export class MessagesService {
  messagesDb: any;
  messagesDbRemote: any;
  messages: Array<Message>;

  @Output()
  change = new EventEmitter();

  constructor() {
    this.messagesDb = new PouchDB();
    this.messagesDbRemote = '/messages';
    const options = {
      live: true,
      retry: true,
      continuous: true,
      timeout: false,
      heartbeat: false,
      ajax: {
        timeout: false,
        hearbeat: false
      }
    };

  }
  getMessages() {
    if (this.messages) {
      return Promise.resolve(this.messages);
    }
    return new Promise(resolve => {
      this.messagesDb.allDocs({
        include_docs: true
      }).then((result) => {
        this.messages = [];
        const docs = result.rows.map((row) => {
          this.messages.push(row.doc);
        });
        resolve(this.messages);
        this.messagesDb.changes({live: true, since: 'now', include_docs: true}).once('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  createMessage(message: Message) {
    this.messagesDb.post(message).then((response) => {
      return true;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
  }

  updateMessage(message: Message) {

  }

  deleteMessage(message: Message) {
    this.messagesDb.remove(message).then((response) => {
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
