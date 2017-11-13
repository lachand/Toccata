import 'zone.js';
import 'reflect-metadata';

import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatSlideToggleModule, MatIconModule, MatDialogModule, MatRadioModule,
  MatTabsModule, MatOptionModule, MatMenuModule, MatCardModule, MatInputModule,
  MatButtonModule, MatToolbarModule, MatTooltipModule, MatProgressBarModule, MatListModule, MatSidenavModule,
  MatFormFieldModule, MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';
import { routes } from './app.routes';
import {ScrollToModule} from 'ng2-scroll-to';
import {jqxKanbanComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import {jqxSplitterComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxsplitter';

import { AppComponent } from './app.component';
import { ChatComponent } from './applications/chat/chat.component';
import { ChatSendComponent } from './applications/chat/chatSend.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login-signin/login.component';
import {LoggedInGuard} from './verifications/logged-in.guards';
import {SigninComponent} from './login-signin/signin.component';
import {MyActivitiesComponent} from './activities/myActivities/myActivities.component';
import {ActivityAppsComponent} from './activities/activityApps/activityApps.component';
import {ActivityService} from 'app/services/activity.service';
import {ResourcesService} from './services/resources.service';
import {AppsService} from './services/apps.service';
import {ExternalAppComponent} from 'app/applications/external/externalApp.component';
import {AppLoadingComponent} from './activities/appLoading/appLoading.component';
import {ActivityEditComponent} from './activities/activity-edition/activityEdit/activityEdit.component';
import {ActivityAppsEditComponent} from './activities/activity-edition/activityAppsEdit/activityAppsEdit.component';
import {ActivityNewAppComponent} from './activities/activity-edition/activityNewApp/activityNewApp.component';
import {ActivityParticipantsEditComponent} from './activities/activity-edition/activityParticipantsEdit/activityParticipantsEdit.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MenuComponent} from './menu/menu.component';
import {ActivityChangeUsersComponent} from './activities/activity-edition/activityChangeUsers/activityChangeUsers.component';
import {ActivityNameEditComponent} from './activities/activity-edition/activityNameEdit/activityNameEdit.component';
import {ActivitySequenceEditComponent} from './activities/activity-edition/activitySequenceEdit/activitySequenceEdit.component';
import {ActivityViewComponent} from './activities/activity-edition/activityView/activityView.component';
import {ActivityDescriptionEditComponent} from './activities/activity-edition/activityDescriptionEdit/activityDescriptionEdit.component';
import {DialogConfirmationComponent} from './dialogConfirmation/dialogConfirmation.component';
import {OrderBy} from './external/orderBy';
import {ActivityResourcesComponent} from './activities/activity-edition/activityResources/activityResources.component';
import {ActivityResourceViewComponent} from './activities/activity-edition/activityResourceView/activityResourceView.component';
import {ActivityInfosComponent} from 'app/activities/activityInfos/activityInfos.component';
import {DatabaseService} from 'app/services/database.service';
import {ActivitySequenceInfosComponent} from './activities/activity-edition/activitySequenceInfos/activitySequenceInfos.component';
import {ResourceInfosComponent} from './activities/activity-edition/resourceInfos/resourceInfos.component';
import {ParticipantInfosComponent} from './activities/activity-edition/participantsInfos/participantInfos.component';
import {ApplicationInfosComponent} from './activities/activity-edition/applicationInfos/applicationInfos.component';
import {PostitComponent} from './applications/postit/postit.component';

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
    ActivityViewComponent,
    ActivityAppsEditComponent,
    ActivityParticipantsEditComponent,
    ActivityNewAppComponent,
    ActivityChangeUsersComponent,
    ActivityNameEditComponent,
    ActivityDescriptionEditComponent,
    ActivitySequenceEditComponent,
    ActivityResourcesComponent,
    ActivityInfosComponent,
    ActivitySequenceInfosComponent,
    ActivityResourceViewComponent,
    ResourceInfosComponent,
    ApplicationInfosComponent,
    jqxKanbanComponent,
    jqxSplitterComponent,
    PostitComponent,
    ParticipantInfosComponent,
    DialogConfirmationComponent,
    MenuComponent,
    OrderBy],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CKEditorModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDialogModule,
    MatRadioModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatOptionModule,
    MatMenuModule,
    MatInputModule,
    MatProgressBarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    FlexLayoutModule,
    ScrollToModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true})
  ],
  entryComponents: [ActivityInfosComponent, AppLoadingComponent, ActivityNewAppComponent, ActivityChangeUsersComponent, DialogConfirmationComponent],
  providers: [UserService, ActivityService, ResourcesService, LoggedInGuard, AppsService, DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
