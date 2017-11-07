import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';

@Component({
  selector: 'app-activity-name-edit',
  templateUrl: './activityNameEdit.component.html',
  styleUrls: ['./activityNameEdit.component.scss']
})

export class ActivityNameEditComponent {
  nameEdition: boolean;
  appName: String = '';
  @Input() edit: boolean;

  constructor(public activityService: ActivityService) {
    this.nameEdition = false;
    this.appName = '';
  }

  switch() {
    this.nameEdition = !this.nameEdition;
  }

  /**
   * Change the name of the activity
   */
  changeTheName() {
    this.activityService.activityEdit(this.activityService.activityLoaded._id, 'name', this.appName)
      .then(() => {
        this.switch();
        this.appName = '';
      });
  }

}
