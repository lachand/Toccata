import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {current} from "codelyzer/util/syntaxKind";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-activity-infos-teacher',
  templateUrl: './activityInfosTeacher.component.html',
  styleUrls: ['./activityInfosTeacher.component.scss']
})

export class ActivityInfosTeacherComponent implements OnInit {

  @Input() activityId;
  activityInfos: any;
  currentLoadedInfos: any;
  currentLoadedName: any;
  constructor(public user: UserService,
              public activityService: ActivityService,
              public router: Router,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
      this.activityInfos = activityInfos;
      this.activityService.getActivityInfos(activityInfos['currentLoaded']).then(currentLoadedInfos => {
        this.currentLoadedInfos = currentLoadedInfos;
        this.currentLoadedName = currentLoadedInfos['name'];
      });
    });
    this.activityService.changes.subscribe((change) => {
      console.log(change);
      if (change.type === 'Main' && change.doc._id === this.activityId) {
        this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
          this.activityInfos = activityInfos;
          this.activityService.getActivityInfos(this.activityInfos['currentLoaded']).then(currentLoadedInfos => {
            this.currentLoadedInfos = currentLoadedInfos;
            this.currentLoadedName = currentLoadedInfos['name'];
            this.ref.detectChanges();
          });
        });
      }
      if (!isNullOrUndefined(this.activityInfos) && change.doc._id === this.activityInfos['currentLoaded']) {
        this.activityService.getActivityInfos(this.activityInfos['currentLoaded']).then(currentLoadedInfos => {
          this.currentLoadedInfos = currentLoadedInfos;
          this.currentLoadedName = currentLoadedInfos['name'];
          this.ref.detectChanges();
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
