import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-activity-sequence-edit',
  templateUrl: './activitySequenceEdit.component.html',
  styleUrls: ['./activitySequenceEdit.component.scss']
})

export class ActivitySequenceEditComponent {
  @Input() edit: boolean;

  constructor(public activityService: ActivityService,
              public userService: UserService,
              public router: Router) {
  }

  newSubactivity() {
    this.activityService.createSubActivity(this.activityService.activityLoaded._id);
  }

}