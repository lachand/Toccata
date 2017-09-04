import { Component } from '@angular/core';
import {MessagesService} from './services/messages.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(public userService: UserService) {
  }
}


