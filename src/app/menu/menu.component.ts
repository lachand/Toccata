import {Component} from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import {ActivityService} from '../services/activity.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(public userService: UserService, public router: Router,
              public activityService: ActivityService) {
  }

  logout() {
    this.activityService.logout();
  }
}
