import PouchDB from 'pouchdb';
import { Message } from '../models/message.model';
import {EventEmitter, Output} from "@angular/core";

export class MessagesService {
  messages_db: any;
  messages_db_remote: any;
  messages: Array<Message>;

  @Output()
  change = new EventEmitter();

  constructor() {
    //this.messages_db = new PouchDB('messages');
    this.messages_db = new PouchDB('http://127.0.0.1:5984/messages');
    this.messages_db_remote = 'http://127.0.0.1:5984/messages';
    const options = {
      live: true,
      retry: true,
      continuous: true
    };
    //this.messages_db.sync(this.messages_db_remote, options);
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
        this.messages_db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
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

  }
  handleChange(change) {
    let changedDoc = null;
    let changedIndex = null;
    this.messages.forEach((doc, index) => {
      if (doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
    });
    if (change.deleted){
      //delete
      this.messages.splice(changedIndex, 1);
      this.change.emit(this.messages);
    }
    else {
      //modification
      if (changedDoc) {
        this.messages[changedIndex] = change.doc;
        this.change.emit(this.messages);
      }
      //new
      else {
        this.messages.push(change.doc);
        this.change.emit(this.messages);
      }
    }
  }
}
