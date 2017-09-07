import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {NgxAutoScroll} from 'ngx-auto-scroll/lib/ngx-auto-scroll.directive';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { ChatComponent } from './applications/chat/chat.component';
import { ChatSendComponent } from './applications/chat/chatSend.component';
import { MessagesService } from './services/messages.service';
import { UserService } from './services/user.service';
import { LoginComponent } from './login-signin/login.component';
import {LoggedInGuard} from './verifications/logged-in.guards';
import {SigninComponent} from './login-signin/signin.component';
import {MyActivitiesComponent} from './activities/myActivities.component';
import {ActivityAppsComponent} from './activities/activityApps.component';
import {ActivityService} from 'app/services/activity.service';
import {RessourcesService} from './services/ressources.service';
import {AppsService} from './services/apps.service';
import {ExternalAppComponent} from 'app/applications/external/externalApp.component';
import {AppLoadingComponent} from './activities/appLoading.component';
import {ActivityEditComponent} from './activities/activity-edition/activityEdit.component';
import {ActivityAppsEditComponent} from './activities/activity-edition/activityAppsEdit.component';
import {ActivityNewAppComponent} from './activities/activity-edition/activityNewApp.component';
import {NewActivityComponent} from './activities/newActivity.component';
import {ActivityParticipantsEditComponent} from './activities/activity-edition/activityParticipantsEdit.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MenuComponent} from './menu/menu.component';
import {ActivityChangeUsersComponent} from './activities/activity-edition/activityChangeUsers.component';
import {ActivityNameEditComponent} from './activities/activity-edition/activityNameEdit.component';

@NgModule({
  declarations: [AppComponent,
    ChatComponent,
    ChatSendComponent,
    ExternalAppComponent,
    ActivityAppsComponent,
    AppLoadingComponent,
    LoginComponent,
    SigninComponent,
    MyActivitiesComponent,
    ActivityEditComponent,
    ActivityAppsEditComponent,
    ActivityParticipantsEditComponent,
    ActivityNewAppComponent,
    ActivityChangeUsersComponent,
    ActivityNameEditComponent,
    NewActivityComponent,
    MenuComponent,
    NgxAutoScroll],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdIconModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  entryComponents: [AppLoadingComponent, ActivityNewAppComponent, NewActivityComponent, ActivityChangeUsersComponent],
  providers: [UserService, ActivityService, RessourcesService, MessagesService, LoggedInGuard, AppsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
