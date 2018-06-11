import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {LoggerService} from "../../../services/logger.service";

@Component({
  selector: 'app-activity-sequence-infos',
  templateUrl: './activitySequenceInfos.component.html',
  styleUrls: ['./activitySequenceInfos.component.scss']
})

export class ActivitySequenceInfosComponent implements OnInit {
  @Input() activityId;
  activityInfos: any;

  constructor(public activityService: ActivityService,
              public userService: UserService,
              public router: Router,
              public logger: LoggerService) {
  }

  ngOnInit(): void {
    this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
      this.activityInfos = activityInfos;
    });
    this.activityService.changes.subscribe((change) => {
      if (change.type === 'Sequence') {
        this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
          this.activityInfos = activityInfos;
        });
      }
    });
  }

  loadActivity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_apps/' + activity_id]);
    });
  }

  showActivity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_view/' + activity_id]);
    });
  }

  editActivity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_edit/' + activity_id]);
    });
  }

  viewOrEdit(activityId) {
    if (this.userService.fonction === 'Enseignant') {
      this.editActivity(activityId);
    } else {
      this.showActivity(activityId);
    }
  }

  /**
   * Change the value of the state of the step
   */
  switchLock() {
    this.activityInfos.blocked = !this.activityInfos.blocked;
    if (!this.activityInfos.blocked) {
      this.logger.log('UPDATE', this.activityService.activityLoaded._id, this.activityInfos['_id'], 'unlock step');
    } else {
      this.logger.log('UPDATE', this.activityService.activityLoaded._id, this.activityInfos['_id'], 'lock step');
    }
    this.activityService.switchLock(this.activityId);
  }

  /**
   * Change the value of the visibility of the step
   */
  switchVisibility() {
    this.activityInfos.visible = !this.activityInfos.visible;
    if (this.activityInfos.visible) {
      this.logger.log('UPDATE', this.activityService.activityLoaded._id, this.activityInfos['_id'], 'show step');
    } else {
      this.logger.log('UPDATE', this.activityService.activityLoaded._id, this.activityInfos['_id'], 'hide step');
    }
    this.activityService.switchVisibility(this.activityId);
  }

  deleteSubactivity(activityId) {
    this.activityService.deleteActivity(activityId);
  }
}
