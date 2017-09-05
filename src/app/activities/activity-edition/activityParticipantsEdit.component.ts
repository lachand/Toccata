import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {ActivityChangeUsersComponent} from './activityChangeUsers.component';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'app-activity-participants-edit',
  templateUrl: './activityParticipantsEdit.component.html'
})

export class ActivityParticipantsEditComponent {
  activity: ActivityService;

  constructor(private activityService: ActivityService, private router: Router, private dialog: MdDialog) {
  }

  private changeParticipants() {
    const dialogRef = this.dialog.open(ActivityChangeUsersComponent);
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

}
