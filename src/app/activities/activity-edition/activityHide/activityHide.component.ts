import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'activity-hide',
  templateUrl: './activityHide.component.html'
})

export class ActivityHideComponent implements OnInit {

  activityName: any;
  activityVisible: any;

  @Input() activityId;

  constructor(public activityService: ActivityService,
              private logger: LoggerService) {
  }

  ngOnInit(): void {
    this.activityService.changes.subscribe(change => {
      if (change.doc._id === this.activityId) {
        this.activityName = change.doc.name;
        this.activityVisible = change.doc.visible
      }
    });
    this.activityService.getActivityInfos(this.activityId).then(res => {
      this.activityName = res['name'];
      this.activityVisible = res['visible'];
    });
  }

}
