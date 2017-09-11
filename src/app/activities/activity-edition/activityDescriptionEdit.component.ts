import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';

@Component({
  selector: 'app-activity-description-edit',
  templateUrl: './activityDescriptionEdit.component.html',
  styleUrls: ['./activityDescriptionEdit.component.scss']
})

export class ActivityDescriptionEditComponent {
  descriptionEdition: boolean;
  description: string;
  @Input() edit: boolean;

  constructor(private activityService: ActivityService) {
    this.descriptionEdition = false;
    this.description = this.activityService.activity_loaded.description;
  }

  switch() {
    this.descriptionEdition = !this.descriptionEdition;
  }

  changeTheDescription() {
    this.activityService.db.get(this.activityService.activity_loaded._id).then( res => {
      res.description = this.description;
      this.activityService.db.put(res).then(this.switch());
    });
  }

}
