import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {NgxAutoScroll} from 'ngx-auto-scroll/lib/ngx-auto-scroll.directive';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat.component';
import { ChatSendComponent } from './chatSend.component';
import { MessagesService } from './messages.service';
import { UserService } from './user.service';
import { LoginComponent } from './login.component';
import {LoggedInGuard} from './logged-in.guards';


@NgModule({
  declarations: [AppComponent,
    ChatComponent,
    ChatSendComponent,
    LoginComponent,
    NgxAutoScroll],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdIconModule,
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  providers: [UserService, MessagesService, LoggedInGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
