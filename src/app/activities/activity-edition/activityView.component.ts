import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activityView.component.html',
  styleUrls: ['./activityView.component.scss']
})

export class ActivityViewComponent {

  constructor(private activityService: ActivityService) {
  }

}
