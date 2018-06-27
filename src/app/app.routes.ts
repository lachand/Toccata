import { LoginComponent } from './login-signin/login.component';
import { ChatComponent } from './applications/chat/chat.component';
import {LoggedInGuard} from './verifications/logged-in.guards';
import {SigninComponent} from './login-signin/signin.component';
import {MyActivitiesComponent} from './activities/myActivities/myActivities.component';
import {ActivityAppsComponent} from './activities/activityApps/activityApps.component';
import {ExternalAppComponent} from './applications/external/externalApp.component';
import {ActivityEditComponent} from './activities/activity-edition/activityEdit/activityEdit.component';
import {ActivityViewComponent} from './activities/activity-edition/activityView/activityView.component';
import {ViewDuplicatesComponent} from './activities/viewDuplicates/viewDuplicates.component';

export const routes = [
  { path: 'login', component: LoginComponent},
  {path: 'activities', component: MyActivitiesComponent},
  {path: '', redirectTo: '/activities', pathMatch: 'full'},
  {path: 'duplicates/:id', component: ViewDuplicatesComponent, canActivate: [LoggedInGuard]},
  { path: 'activity_edit/:id', component: ActivityEditComponent, canActivate: [LoggedInGuard]},
  { path: 'activity_view/:id', component: ActivityViewComponent, canActivate: [LoggedInGuard]},
  { path: 'activity_apps/:id', component: ActivityAppsComponent/**, canActivate: [LoggedInGuard]**/, children:
      [{ path: 'Chat/:id', component: ChatComponent, /**canActivate: [LoggedInGuard],**/ outlet: 'apps'},
        { path: 'Externe/:id', component: ExternalAppComponent, /**canActivate: [LoggedInGuard],**/ outlet: 'apps'},
        { path: 'Editeur de texte/:id', component: ExternalAppComponent, /**canActivate: [LoggedInGuard],**/ outlet: 'apps'},
        { path: 'Feuille de calcul/:id', component: ExternalAppComponent, /**canActivate: [LoggedInGuard],**/ outlet: 'apps'}]},
  { path: 'inscription', component: SigninComponent}
];
