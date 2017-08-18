import { LoginComponent } from './login.component';
import { ChatComponent } from './chat.component';
import {LoggedInGuard} from './logged-in.guards';

export const routes = [
//  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'chat', component: ChatComponent, canActivate: [LoggedInGuard] }
];
