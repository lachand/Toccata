import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})

export class ChatComponent {
  messagesService: any;
  messages: any;

  constructor(messagesService: MessagesService) {
    this.messagesService = messagesService;
    this.messagesService.getMessages().then((data) => {
      this.messages = data;
      this.messages.sort(function(a, b){return a.date - b.date; });
    });
  }
}
