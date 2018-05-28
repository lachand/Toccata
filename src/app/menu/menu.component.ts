import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {ActivityService} from '../services/activity.service';
import {Location} from '@angular/common';
import {isNullOrUndefined} from 'util';
import {DatabaseService} from "../services/database.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(public userService: UserService, public router: Router,
              public activityService: ActivityService, public databaseService: DatabaseService) {
  }

  logout() {
    this.activityService.logout();
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

  goToActivities() {
    this.router.navigate(['/activities']);
  }

}
