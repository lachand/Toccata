import { Component} from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivityService} from '../services/activity.service';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-activity',
  templateUrl: './newActivity.component.html'
})

export class NewActivityComponent {
  dialogRef: MdDialogRef<NewActivityComponent>;
  activityName: any;

  constructor(private activityService: ActivityService, private user: UserService, private router: Router) {
  }

  createActivity() {
    const activityName = this.activityName;
    this.activityService.createActivity({
      'name': activityName,
      'participants': [this.user.id]}).then(res => {
        console.log(res['id']);
        this.activityService.load_activity(res['id']).then( result => {
          this.router.navigate(['activity_edit']);
        });
    });
    this.dialogRef.close();
  }

}
