import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatSlideToggleModule, MatIconModule, MatDialogModule, MatRadioModule,
  MatTabsModule, MatOptionModule, MatMenuModule, MatCardModule, MatInputModule,
  MatButtonModule, MatToolbarModule, MatTooltipModule, MatProgressBarModule, MatListModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';
import { routes } from './app.routes';
import {ScrollToModule} from 'ng2-scroll-to';

import { AppComponent } from './app.component';
import { ChatComponent } from './applications/chat/chat.component';
import { ChatSendComponent } from './applications/chat/chatSend.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login-signin/login.component';
import {LoggedInGuard} from './verifications/logged-in.guards';
import {SigninComponent} from './login-signin/signin.component';
import {MyActivitiesComponent} from './activities/myActivities.component';
import {ActivityAppsComponent} from './activities/activityApps.component';
import {ActivityService} from 'app/services/activity.service';
import {ResourcesService} from './services/resources.service';
import {AppsService} from './services/apps.service';
import {ExternalAppComponent} from 'app/applications/external/externalApp.component';
import {AppLoadingComponent} from './activities/appLoading.component';
import {ActivityEditComponent} from './activities/activity-edition/activityEdit.component';
import {ActivityAppsEditComponent} from './activities/activity-edition/activityAppsEdit.component';
import {ActivityNewAppComponent} from './activities/activity-edition/activityNewApp.component';
import {ActivityParticipantsEditComponent} from './activities/activity-edition/activityParticipantsEdit.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MenuComponent} from './menu/menu.component';
import {ActivityChangeUsersComponent} from './activities/activity-edition/activityChangeUsers.component';
import {ActivityNameEditComponent} from './activities/activity-edition/activityNameEdit.component';
import {ActivitySequenceEditComponent} from './activities/activity-edition/activitySequenceEdit.component';
import {ActivityViewComponent} from './activities/activity-edition/activityView.component';
import {ActivityDescriptionEditComponent} from './activities/activity-edition/activityDescriptionEdit.component';
import {DialogConfirmationComponent} from './activities/dialogConfirmation.component';
import {OrderBy} from './external/orderBy';
import {ActivityResourcesComponent} from './activities/activity-edition/activityResources.component';

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
    DialogConfirmationComponent,
    MenuComponent,
    OrderBy],
  imports: [
    BrowserModule,
    FormsModule,
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
    FlexLayoutModule,
    ScrollToModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true})
  ],
  entryComponents: [AppLoadingComponent, ActivityNewAppComponent, ActivityChangeUsersComponent, DialogConfirmationComponent],
  providers: [UserService, ActivityService, ResourcesService, LoggedInGuard, AppsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
