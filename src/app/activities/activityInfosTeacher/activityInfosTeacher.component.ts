import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {current} from "codelyzer/util/syntaxKind";

@Component({
  selector: 'app-activity-infos-teacher',
  templateUrl: './activityInfosTeacher.component.html',
  styleUrls: ['./activityInfosTeacher.component.scss']
})

export class ActivityInfosTeacherComponent implements OnInit {

  @Input() activityId;
  activityInfos: any;
  currentLoadedInfos: any;

  constructor(public user: UserService,
              public activityService: ActivityService,
              public router: Router) {
  }

  ngOnInit(): void {
    this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
      this.activityInfos = activityInfos;
      this.activityService.getActivityInfos(activityInfos['currentLoaded']).then(currentLoadedInfos => {
        this.currentLoadedInfos = currentLoadedInfos;
        console.log(this.currentLoadedInfos);
      });
    });
    this.activityService.changes.subscribe((change) => {
      console.log(change);
      if (change.type === 'Main') {
        this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
          this.activityInfos = activityInfos;
        });
      }
    });
  }

  /**
   * Show a specific activity
   * @param activity_id
   */
  show_activity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_view/' + activity_id]);
    });
  }

  /**
   * Edit a specific activity
   * @param activity_id
   */
  edit_activity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_edit/' + activity_id]);
    });
  }
}
