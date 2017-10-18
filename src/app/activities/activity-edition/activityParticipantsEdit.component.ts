import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {ActivityChangeUsersComponent} from './activityChangeUsers.component';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-activity-participants-edit',
  templateUrl: './activityParticipantsEdit.component.html',
  styleUrls: ['activityParticipantsEdit.component.scss']
})

export class ActivityParticipantsEditComponent {

  activity: ActivityService;
  @Input() edit: boolean;

  constructor(public activityService: ActivityService,
              public router: Router,
              public dialog: MatDialog,
              public userService: UserService) {
  }

  private changeParticipants() {
    const dialogRef = this.dialog.open(ActivityChangeUsersComponent);
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

}
