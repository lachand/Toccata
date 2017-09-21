import {Component, Input} from '@angular/core';
import {UserService} from '../../services/user.service';
import {RessourcesService} from 'app/services/ressources.service';
import {ActivityService} from '../../services/activity.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})

export class ChatComponent {
  messages: any;

  @Input() chatId;

  constructor(public ressourcesServices: RessourcesService,
              public user: UserService,
              public route: ActivatedRoute) {
    this.route.params.subscribe( result => {
      this.chatId = result.id;
      this.changeChat();
    });
    this.ressourcesServices.getRessources({type: 'chat', id: this.chatId}).then( res => {
      this.messages = res;
      this.messages.sort(function(a, b){return a.date - b.date; });
      for (let i = 0; i < this.messages.length; i++) {
          this.canEdit(this.messages[i]);
      }​
    });
  }

  changeChat() {
    this.ressourcesServices.getRessources({type: 'chat', id: this.chatId}).then( res => {
      this.messages = res;
      this.messages.sort(function(a, b){return a.date - b.date; });
      for (let i = 0; i < this.messages.length; i++) {
        this.canEdit(this.messages[i]);
      }​
    });
  }

  canEdit(message) {
      if ((this.user.name === message.author.name) || (this.user.fonction === 'Enseignant')) {
        message.editable = true;
        return true;
      }
      message.editable = false;
      return false;
  }

  deleteMessage(message) {
    console.log('Fausse suppression');
  }

}
