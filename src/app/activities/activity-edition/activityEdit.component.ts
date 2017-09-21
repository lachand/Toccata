import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activityEdit.component.html',
  styleUrls: ['./activityEdit.component.scss']
})

export class ActivityEditComponent {

  constructor(public activityService: ActivityService) {
  }

}
