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
  constructor(public userService: UserService,
              public router: Router,
              public activityService: ActivityService,
              public databaseService: DatabaseService,
              private _location: Location) {
  }

  logout() {
    this.activityService.logout();
    this.router.navigate(['/login']);
  }

  isNullOrUndefined(elmt) {
    return isNullOrUndefined(elmt);
  }

  goToActivities() {
    this.router.navigate(['/activities']);
  }

  backClicked() {
    this._location.back();
    if (this._location.path().includes('activity_view')) {
      const parts = this._location.path().split('/');
      const activityId = parts[parts.length - 1];
      this.activityService.setCurrentActivity(activityId).then(() => {
        this.activityService.load_activity(activityId).then(res => {
          this.router.navigate(['activity_view/' + activityId]);
        });
      });
    }
  }

}
