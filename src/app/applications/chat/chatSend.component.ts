import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {ResourcesService} from '../../services/resources.service';

@Component({
  selector: 'app-chat-send',
  templateUrl: './chatSend.component.html',
})

export class ChatSendComponent implements OnInit {
  sendMessage: FormGroup;
  userName: any;
  userId: any;
  userAvatar: any;
  @Input() loadedChat: any;

  constructor(
    public formBuilder: FormBuilder,
    public user: UserService,
    public resourcesService: ResourcesService
  ) {}

  ngOnInit() {
    this.resetDefault();
    this.sendMessage.value['author']['name'] = this.user.name;
    this.sendMessage.value['author']['_id'] = this.user.id;
    this.sendMessage.value['author']['avatar'] = this.user.avatar;
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
      //this.resourcesService.createResource(this.sendMessage.value);
      this.resetDefault();
    }
  }
}
