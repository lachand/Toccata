import {Component} from '@angular/core';
import {ActivityService} from '../services/activity.service';
import {Router} from '@angular/router';
import {MdDialog} from '@angular/material';
import {NewActivityComponent} from './newActivity.component';
import {UserService} from '../services/user.service';
import {DialogConfirmationComponent} from "./dialogConfirmation.component";

@Component({
  selector: 'app-my-activities',
  templateUrl: './myActivities.component.html',
  styleUrls: ['myActivities.component.scss']
})

export class MyActivitiesComponent {
  activities: any;
  dialog: any;

  constructor(private user: UserService, private activityService: ActivityService, private router: Router,
              dialog: MdDialog) {
    this.dialog = dialog;
  }

  load_activity(activity_id) {
    this.activityService.load_activity(activity_id).then( res => {
      this.router.navigate(['activity_apps/' + activity_id]);
    });
  }

  show_activity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_view/' + activity_id]);
    });
  }

  edit_activity(activity_id) {
    this.activityService.load_activity(activity_id).then( res => {
      this.router.navigate(['activity_edit/' + activity_id]);
    });
  }

  newActivity() {
    const dialogRef = this.dialog.open(NewActivityComponent);
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

  delete_activity(activityId) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { message: 'Voulez vous vraiment supprimer cette activité ?' },
    });
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {this.activityService.delete_activity(activityId); }
    });
    //this.activityService.delete_activity(activityId);
  }

  duplicate_activity(activityId) {
    this.activityService.duplicate(activityId);
}
}
