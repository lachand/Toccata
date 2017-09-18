import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {ActivityChangeUsersComponent} from './activityChangeUsers.component';
import {MdDialog} from '@angular/material';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-activity-participants-edit',
  templateUrl: './activityParticipantsEdit.component.html'
})

export class ActivityParticipantsEditComponent {

  activity: ActivityService;
  @Input() edit: boolean;

  constructor(private activityService: ActivityService,
              private router: Router,
              private dialog: MdDialog,
              private userService: UserService) {
  }

  private changeParticipants() {
    const dialogRef = this.dialog.open(ActivityChangeUsersComponent);
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

}
