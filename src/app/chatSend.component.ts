import PouchDB from 'pouchdb';
import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesService } from './messages.service';
import {UserService} from './user.service';

@Component({
  selector: 'app-chat-send',
  templateUrl: './chatSend.component.html'
})

export class ChatSendComponent implements OnInit {
  sendMessage: FormGroup;
  messages_db: any;
  messagesService: any;
  user: any;
  userName: any;
  userId: any;

  constructor(
    private formBuilder: FormBuilder,
    messagesService: MessagesService,
    userService: UserService,
  ) {
    this.messagesService = messagesService;
    this.messages_db = messagesService.messages_db;
    this.user = userService;
  }

  ngOnInit() {
    this.resetDefault();
    this.user.getUsername().then( (res) => {
      this.userName = res;
      this.sendMessage.value['author']['name'] = res;
    });
    this.user.getId().then( (res) => {
      this.userId = res;
      this.sendMessage.value['author']['_id'] = res;
    });
  }

  resetDefault() {
    this.sendMessage = this.formBuilder.group({
      author: [{
        '_id' : this.userId,
        'name' : this.userName,
        'avatar' : 'http://mondesfrancophones.com/wp-content/Cimy_User_Extra_Fields/clarouche/Christian%20Larouche.JPG'
      }],
      text: [''],
      date: []
    });
  }

  addMessage(): void {
    if (this.sendMessage.valid) {
      this.sendMessage.value.date = moment().format("x");
      this.messagesService.createMessage(this.sendMessage.value);
      this.resetDefault();
    }
  }
}
