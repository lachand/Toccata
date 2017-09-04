import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-activity-participants-edit',
  templateUrl: './activityParticipantsEdit.component.html'
})

export class ActivityParticipantsEditComponent {
  activity: ActivityService;

  constructor(private activityService: ActivityService, private router: Router) {
  }

}
