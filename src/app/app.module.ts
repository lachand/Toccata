import "zone.js";
import "reflect-metadata";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { routes } from "./app.routes";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login-signin/login.component";
import { SigninComponent } from "./login-signin/signin.component";
import { MyActivitiesComponent } from "./activities/myActivities/myActivities.component";
import { ActivityAppsComponent } from "./activities/activityApps/activityApps.component";
import { AppLoadingComponent } from "./activities/appLoading/appLoading.component";
import { ActivityEditComponent } from "./activities/activity-edition/activityEdit/activityEdit.component";
import { ActivityAppsEditComponent } from "./activities/activity-edition/activityAppsEdit/activityAppsEdit.component";
import { ActivityNewAppComponent } from "./activities/activity-edition/activityNewApp/activityNewApp.component";
import { ActivityParticipantsEditComponent } from "./activities/activity-edition/activityParticipantsEdit/activityParticipantsEdit.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MenuComponent } from "./menu/menu.component";
import { ActivityChangeUsersComponent } from "./activities/activity-edition/activityChangeUsers/activityChangeUsers.component";
import { ActivityNameEditComponent } from "./activities/activity-edition/activityNameEdit/activityNameEdit.component";
import { ActivitySequenceEditComponent } from "./activities/activity-edition/activitySequenceEdit/activitySequenceEdit.component";
import { ActivityViewComponent } from "./activities/activity-edition/activityView/activityView.component";
import { ActivityDescriptionEditComponent } from "./activities/activity-edition/activityDescriptionEdit/activityDescriptionEdit.component";
import { DialogConfirmationComponent } from "./dialogConfirmation/dialogConfirmation.component";
import { DialogInformationComponent } from "./dialogInformation/dialogInformation.component";
import { OrderBy } from "./external/orderBy";
import { ActivityResourcesComponent } from "./activities/activity-edition/activityResources/activityResources.component";
import { ActivityResourceViewComponent } from "./activities/activity-edition/activityResourceView/activityResourceView.component";
import { ActivityInfosComponent } from "./activities/activityInfos/activityInfos.component";
import { ActivitySequenceInfosComponent } from "./activities/activity-edition/activitySequenceInfos/activitySequenceInfos.component";
import { ResourceInfosComponent } from "./activities/activity-edition/resourceInfos/resourceInfos.component";
import { ParticipantInfosComponent } from "./activities/activity-edition/participantsInfos/participantInfos.component";
import { ApplicationInfosComponent } from "./activities/activity-edition/applicationInfos/applicationInfos.component";
import { ActivityNameComponent } from "./activities/activity-edition/activityName/activityName.component";
import { ApplicationLaunchedComponent } from "./activities/activity-edition/applicationLaunched/applicationLaunched.component";
import { ViewDuplicatesComponent } from "./activities/viewDuplicates/viewDuplicates.component";
import { DialogDuplicateNameComponent } from "./activities/viewDuplicates/dialogDuplicateName/dialogDuplicateName.component";
import { ActivityInfosTeacherComponent } from "./activities/activityInfosTeacher/activityInfosTeacher.component";
import { ChronometreInfosComponent } from "./activities/activity-edition/chronometreInfos/chronometreInfos.component";
import { ApplicationInfosTeacherComponent } from "./activities/activity-edition/applicationInfosTeacher/applicationInfosTeacher.component";
import { PostitInfosComponent } from "./activities/activity-edition/postitInfos/postitInfos.component";
import { CreateEditPostitComponent } from "./activities/createEditPostit/createEditPostit.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ResourceOpenedComponent } from "./activities/activity-edition/resourceOpened/resourceOpened.component";
import { DialogNewRessourceComponent } from "./activities/activity-edition/dialogNewRessource/dialognewRessource.component";
import { ActivityNewRessourceComponent } from "./activities/activity-edition/activityNewRessource/activityNewRessource.component";
import { DialogResourceOpenedComponent } from "./activities/activity-edition/dialogResourceOpened/dialogResourceOpened.component";
import { DialogApplicationLaunchedComponent } from "./activities/activity-edition/dialogApplicationLaunched/dialogApplicationLaunched.component";
import { DialogResourceEditionComponent } from "./activities/activity-edition/resourceInfos/dialogResourceEdition/dialogResourceEdition.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { ActivityHideComponent } from "./activities/activity-edition/activityHide/activityHide.component";
import { AppNotesComponent } from "./activities/activity-edition/appNotes/appNotes.component";
import { ActivityStepperComponent } from "./activities/activity-edition/activityStepper/activityStepper.component";
import { DragulaModule } from "ng2-dragula";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { ApplicationsModule } from "./applications/applications.module";
import { MaterialDesignModule } from "./materialDesign.module";
import { ServicesModule } from "./services/services.module";
import { DialogTextEditionComponent } from './activities/activity-edition/dialogTextEditor/dialogTextEdition.component';
import { ActivityResourcesApplicationsComponent } from './activities/activity-edition/activityResourcesApplications/activityResourcesApplications.component';
import { DialogNewResourcesApplcationsComponent } from './activities/activity-edition/dialogNewResourcesApplications/dialogNewResourcesApplcations.component';
import { MatFileUploadModule } from 'angular-material-fileupload';

@NgModule({
  declarations: [
    AppComponent,
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
    ActivityResourcesApplicationsComponent,
    ActivityInfosTeacherComponent,
    ApplicationInfosTeacherComponent,
    ApplicationInfosComponent,
    ChronometreInfosComponent,
    PostitInfosComponent,
    ActivitySequenceInfosComponent,
    ActivityResourceViewComponent,
    CreateEditPostitComponent,
    ActivityNameComponent,
    ApplicationLaunchedComponent,
    ResourceOpenedComponent,
    ViewDuplicatesComponent,
    ResourceInfosComponent,
    ParticipantInfosComponent,
    DialogConfirmationComponent,
    DialogInformationComponent,
    ActivityNewRessourceComponent,
    DialogNewRessourceComponent,
    DialogDuplicateNameComponent,
    DialogTextEditionComponent,
    MenuComponent,
    OrderBy,
    DialogResourceOpenedComponent,
    DialogResourceEditionComponent,
    DialogApplicationLaunchedComponent,
    DialogNewResourcesApplcationsComponent,
    ActivityHideComponent,
    AppNotesComponent,
    ActivityStepperComponent
  ],
  imports: [
    ServicesModule,
    MaterialDesignModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatFileUploadModule,
    HttpModule,
    BrowserAnimationsModule,
    CKEditorModule,
    FlexLayoutModule,
    ServiceWorkerModule.register("/ngsw-worker.js"),
    DragulaModule.forRoot(),
    ScrollToModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: true }),
    ApplicationsModule
  ],
  entryComponents: [
    ActivityInfosComponent,
    AppLoadingComponent,
    ActivityNewAppComponent,
    ActivityChangeUsersComponent,
    DialogConfirmationComponent,
    DialogInformationComponent,
    DialogDuplicateNameComponent,
    DialogTextEditionComponent,
    DialogNewResourcesApplcationsComponent,
    ActivityNewRessourceComponent,
    DialogNewRessourceComponent,
    CreateEditPostitComponent,
    DialogResourceOpenedComponent,
    DialogApplicationLaunchedComponent,
    DialogResourceEditionComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
