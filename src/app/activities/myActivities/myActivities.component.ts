import {Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {DialogConfirmationComponent} from '../../dialogConfirmation/dialogConfirmation.component';
import {DatabaseService} from "../../services/database.service";
import {LoggerService} from "../../services/logger.service";

@Component({
  selector: 'app-my-activities',
  templateUrl: './myActivities.component.html',
  styleUrls: ['./myActivities.component.scss']
})

export class MyActivitiesComponent {
  activities: any;
  dialog: any;

  constructor(public user: UserService,
              public activityService: ActivityService,
              public router: Router,
              dialog: MatDialog,
              public databaseService: DatabaseService,
              private logger: LoggerService) {
    if (!user.loggedIn) {
      this.router.navigate(['login']);
    }
    this.dialog = dialog;
    this.logger.log('OPEN', 'NA', 'NA', 'open activities list');
  }

  load_activity(activity_id) {
    this.activityService.load_activity(activity_id).then( res => {
      console.log(this.router);
      this.router.navigate(['activity_apps/' + activity_id]);
    });
  }

  show_activity(activity_id) {
    this.logger.log('CREATE', activity_id, activity_id, 'open activity view')
    this.activityService.load_activity(activity_id).then(res => {
      console.log(this.router);
      this.router.navigate(['activity_view/' + activity_id]);
    });
  }

  edit_activity(activity_id) {
    this.logger.log('CREATE', activity_id, activity_id, 'open activity edition')
    this.activityService.load_activity(activity_id).then( res => {
      this.router.navigate(['activity_edit/' + activity_id]);
    });
  }

  newActivity() {
    this.activityService.createActivity('Main')
      .then(res => {
        this.logger.log('CREATE', this.activityService.activityLoaded._id, res['id'], 'duplicate activity')
        /**console.log(res['id']);
      this.activityService.user.db.get(this.user.id).then( res2 => {
        res2.activites.push({
          'id' : res['id'],
          'status' : 'paused'});
        console.log(res2.activites);
        this.activityService.user.db.put(res2).then( res3 => {
          console.log(res3);
          this.activityService.load_activity(res['id']);
        });
      });**/
    });
  }

  delete_activity(activityId, $event) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { message: 'Voulez vous vraiment supprimer cette activité ?' },
    });
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {return this.activityService.delete_activity(activityId); }
    });
    this.logger.log('DELETE', activityId, activityId, 'delete activity');
  }

  duplicate_activity(activityId) {
    this.logger.log('CREATE', activityId, activityId, 'duplicate activity');
    this.activityService.duplicate(activityId);
}

  view_or_edit(activityId) {
  if (this.user.fonction === 'Enseignant') {
    this.edit_activity(activityId);
  } else {
    this.show_activity(activityId);
  }
}

  activity_change_status(activityId, status) {
    if (this.user.fonction === 'Enseignant') {
      //return this.user.setActivityStatusByTeacher(activityId, status);
    } else {
      //return this.user.setActivityStatusByStudent(activityId, status);
    }
}
}
