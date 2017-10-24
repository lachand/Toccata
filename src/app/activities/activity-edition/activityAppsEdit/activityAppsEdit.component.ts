import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ActivityNewAppComponent} from '../activityNewApp/activityNewApp.component';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-activity-apps-edit',
  templateUrl: './activityAppsEdit.component.html',
  styleUrls: ['./activityAppsEdit.component.scss']
})

export class ActivityAppsEditComponent {
  dialog: any;
  @Input() edit: boolean;

  constructor(public activityService: ActivityService, public router: Router,
              public user: UserService, dialog: MatDialog) {
    this.dialog = dialog;
  }

  newApp() {
      const dialogRef = this.dialog.open(ActivityNewAppComponent);
      dialogRef.componentInstance.dialogRef = dialogRef;
  }

  private delete_app(appId) {
    this.activityService.apps.deleteApp(appId);
  }
}
