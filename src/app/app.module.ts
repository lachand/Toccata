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
  MatFormFieldModule, MatSelectModule, MatStepperModule, MatProgressSpinnerModule, MatDividerModule, MatChipsModule,
  MAT_DIALOG_DEFAULT_OPTIONS, MatButtonToggleModule, MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { routes } from './app.routes';
import {jqxKanbanComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxkanban';
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login-signin/login.component';
import {LoggedInGuard} from './verifications/logged-in.guards';
import {SigninComponent} from './login-signin/signin.component';
import {MyActivitiesComponent} from './activities/myActivities/myActivities.component';
import {ActivityAppsComponent} from './activities/activityApps/activityApps.component';
import {ActivityService} from './services/activity.service';
import {ResourcesService} from './services/resources.service';
import {AppsService} from './services/apps.service';
import {ExternalAppComponent} from './applications/external/externalApp.component';
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
import {ActivityInfosComponent} from './activities/activityInfos/activityInfos.component';
import {DatabaseService} from './services/database.service';
import {ActivitySequenceInfosComponent} from './activities/activity-edition/activitySequenceInfos/activitySequenceInfos.component';
import {ResourceInfosComponent} from './activities/activity-edition/resourceInfos/resourceInfos.component';
import {ParticipantInfosComponent} from './activities/activity-edition/participantsInfos/participantInfos.component';
import {ApplicationInfosComponent} from './activities/activity-edition/applicationInfos/applicationInfos.component';
import {PostitComponent} from './applications/postit/postit.component';
import {ChronometreComponent} from './applications/chronometre/chronometre.component';
import {TextEditorComponent} from './applications/textEditor/textEditor.component';
import {ActivityNameComponent} from './activities/activity-edition/activityName/activityName.component';
import {ApplicationLaunchedComponent} from './activities/activity-edition/applicationLaunched/applicationLaunched.component';
import {ViewDuplicatesComponent} from './activities/viewDuplicates/viewDuplicates.component';
import {DialogDuplicateNameComponent} from './activities/viewDuplicates/dialogDuplicateName/dialogDuplicateName.component';
import {ActivityInfosTeacherComponent} from './activities/activityInfosTeacher/activityInfosTeacher.component';
import {ChronometreInfosComponent} from './activities/activity-edition/chronometreInfos/chronometreInfos.component';
import {ApplicationInfosTeacherComponent} from './activities/activity-edition/applicationInfosTeacher/applicationInfosTeacher.component';
import {PostitInfosComponent} from './activities/activity-edition/postitInfos/postitInfos.component';
import {CreateEditPostitComponent} from './activities/createEditPostit/createEditPostit.component';
import {LoggerService} from './services/logger.service';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ResourceOpenedComponent} from './activities/activity-edition/resourceOpened/resourceOpened.component';
import {DialogNewRessourceComponent} from './activities/activity-edition/dialogNewRessource/dialognewRessource.component';
import {ActivityNewRessourceComponent} from './activities/activity-edition/activityNewRessource/activityNewRessource.component';
import {DialogResourceOpenedComponent} from './activities/activity-edition/dialogResourceOpened/dialogResourceOpened.component';
import {DialogApplicationLaunchedComponent} from './activities/activity-edition/dialogApplicationLaunched/dialogApplicationLaunched.component';
import {DialogResourceEditionComponent} from './activities/activity-edition/resourceInfos/dialogResourceEdition/dialogResourceEdition.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {ActivityHideComponent} from './activities/activity-edition/activityHide/activityHide.component';
import {AppNotesComponent} from './activities/activity-edition/appNotes/appNotes.component';
import {ActivityStepperComponent} from './activities/activity-edition/activityStepper/activityStepper.component';
import {DragulaModule} from 'ng2-dragula';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  declarations: [AppComponent,
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
    ActivityInfosTeacherComponent,
    ApplicationInfosTeacherComponent,
    ApplicationInfosComponent,
    ChronometreInfosComponent,
    TextEditorComponent,
    TextEditorComponent,
    PostitInfosComponent,
    ActivitySequenceInfosComponent,
    ActivityResourceViewComponent,
    CreateEditPostitComponent,
    ActivityNameComponent,
    ApplicationLaunchedComponent,
    ResourceOpenedComponent,
    ViewDuplicatesComponent,
    ChronometreComponent,
    ResourceInfosComponent,
    jqxKanbanComponent,
    jqxSplitterComponent,
    PostitComponent,
    ParticipantInfosComponent,
    DialogConfirmationComponent,
    ActivityNewRessourceComponent,
    DialogNewRessourceComponent,
    DialogDuplicateNameComponent,
    MenuComponent,
    OrderBy,
    DialogResourceOpenedComponent,
    DialogResourceEditionComponent,
    DialogApplicationLaunchedComponent,
    ActivityHideComponent,
    AppNotesComponent,
    ActivityStepperComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CKEditorModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDialogModule,
    MatRadioModule,
    MatStepperModule,
    MatTabsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatMenuModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('/ngsw-worker.js'),
    DragulaModule.forRoot(),
    ScrollToModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true})
  ],
  entryComponents: [ActivityInfosComponent,
    AppLoadingComponent,
    ActivityNewAppComponent,
    ActivityChangeUsersComponent,
    DialogConfirmationComponent,
    DialogDuplicateNameComponent,
    ActivityNewRessourceComponent,
    DialogNewRessourceComponent,
    CreateEditPostitComponent,
    DialogResourceOpenedComponent,
    DialogApplicationLaunchedComponent,
    DialogResourceEditionComponent
  ],
  providers: [UserService, ActivityService, ResourcesService, LoggedInGuard, AppsService, DatabaseService, LoggerService, {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
