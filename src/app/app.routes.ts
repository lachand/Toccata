import { LoginComponent } from './login-signin/login.component';
import { ChatComponent } from './applications/chat/chat.component';
import {LoggedInGuard} from './verifications/logged-in.guards';
import {SigninComponent} from './login-signin/signin.component';
import {MyActivitiesComponent} from './activities/myActivities.component';
import {ActivityAppsComponent} from './activities/activityApps.component';
import {ExternalAppComponent} from './applications/external/externalApp.component';
import {ActivityEditComponent} from './activities/activity-edition/activityEdit.component';

export const routes = [
//  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'activities', component: MyActivitiesComponent, canActivate: [LoggedInGuard] },
  { path: 'activity_edit', component: ActivityEditComponent, canActivate: [LoggedInGuard]},
  { path: 'activity_apps', component: ActivityAppsComponent/**, canActivate: [LoggedInGuard]**/, children:
    [{ path: 'Chat/:id', component: ChatComponent, /**canActivate: [LoggedInGuard],**/ outlet: 'apps'},
      { path: 'Externe/:id', component: ExternalAppComponent, /**canActivate: [LoggedInGuard],**/ outlet: 'apps'}]},
  { path: 'inscription', component: SigninComponent}
];
