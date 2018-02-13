import {Component, Input} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from "../../../services/logger.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-activity-name-edit',
  templateUrl: './activityNameEdit.component.html',
  styleUrls: ['./activityNameEdit.component.scss']
})

export class ActivityNameEditComponent {
  nameEdition: boolean;
  appName: String = '';
  viewActivity: any;
  @Input() edit: boolean;

  constructor(public activityService: ActivityService, private logger: LoggerService, private router: Router) {
    this.nameEdition = false;
    this.appName = '';
    this.viewActivity = '';
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

  onHovering($event: Event) {
    this.viewActivity = "Voir l'activité";
  }

  onUnovering($event: Event) {
    this.viewActivity = '';
  }

  activityView() {
    this.logger.log('OPEN', this.activityService.activityLoaded._id, this.activityService.activityLoaded._id, 'open activity edition');
    this.activityService.load_activity(this.activityService.activityLoaded._id).then(res => {
      this.router.navigate(['activity_view/' + this.activityService.activityLoaded._id]);
    });
  }

}
