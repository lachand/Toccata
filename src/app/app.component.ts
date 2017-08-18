import { Component } from '@angular/core';
import {MessagesService} from './messages.service';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public userService: UserService, public messagesService: MessagesService) {
  }
}


