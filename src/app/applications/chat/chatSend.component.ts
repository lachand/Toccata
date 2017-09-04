import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {RessourcesService} from '../../services/ressources.service';

@Component({
  selector: 'app-chat-send',
  templateUrl: './chatSend.component.html',
})

export class ChatSendComponent implements OnInit {
  sendMessage: FormGroup;
  ressourcesService: any;
  user: any;
  userName: any;
  userId: any;
  userAvatar: any;
  @Input() loadedChat: any;

  constructor(
    private formBuilder: FormBuilder,
    userService: UserService,
    ressourcesService: RessourcesService
  ) {
    this.ressourcesService = ressourcesService;
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
    this.user.getAvatar().then( (res) => {
      this.userAvatar = res;
      this.sendMessage.value['author']['avatar'] = res;
    });
    this.sendMessage.value['activites'] = [['3521d40f-ac00-42f4-8099-7594080bca3e']];
    this.sendMessage.value['applications'] = [[this.loadedChat]];
  }

  resetDefault() {
    this.sendMessage = this.formBuilder.group({
      author: [{
        '_id' : this.userId,
        'name' : this.userName,
        'avatar' : this.userAvatar
      }],
      text: [''],
      date: [],
      activites: [['3521d40f-ac00-42f4-8099-7594080bca3e']],
      applications: [[this.loadedChat]]
    });
  }

  addMessage(): void {
    if (this.sendMessage.valid) {
      this.sendMessage.value.date = moment().format('x');
      this.ressourcesService.createRessource(this.sendMessage.value);
      this.resetDefault();
    }
  }
}
