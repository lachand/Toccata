import { Component} from '@angular/core';
import {ActivityService} from '../../services/activity.service';

@Component({
  selector: 'app-activity-sequence-edit',
  templateUrl: './activitySequenceEdit.component.html',
  styleUrls: ['./activitySequenceEdit.component.scss']
})

export class ActivitySequenceEditComponent {

  constructor(private activityService: ActivityService) {
    console.log(this.activityService.activity_loaded_child);
  }

}
