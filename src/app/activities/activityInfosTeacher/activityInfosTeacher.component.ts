import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {isNullOrUndefined} from 'util';
import {ViewRef_} from '@angular/core/src/view';
import {LoggerService} from '../../services/logger.service';
import {DatabaseService} from '../../services/database.service';

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
              public database: DatabaseService,
              public router: Router,
              private ref: ChangeDetectorRef,
              private logger: LoggerService) {
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
      if (change.type === 'Activity' && change.doc._id === this.activityId) {
        this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
          console.log(activityInfos);
          this.activityInfos = activityInfos;
          this.activityService.getActivityInfos(this.activityInfos['currentLoaded']).then(currentLoadedInfos => {
            this.currentLoadedInfos = currentLoadedInfos;
            this.currentLoadedName = currentLoadedInfos['name'];
            console.log(this.currentLoadedName)
            if (this.ref !== null &&
              this.ref !== undefined &&
              !(this.ref as ViewRef_).destroyed) {
              this.ref.detectChanges();
            }
          });
        });
      }
      if (!isNullOrUndefined(this.activityInfos) && change.doc._id === this.activityInfos['currentLoaded']) {
        this.activityService.getActivityInfos(this.activityInfos['currentLoaded']).then(currentLoadedInfos => {
          this.currentLoadedInfos = currentLoadedInfos;
          this.currentLoadedName = currentLoadedInfos['name'];
          if (this.ref !== null &&
            this.ref !== undefined &&
            !(this.ref as ViewRef_).destroyed) {
            this.ref.detectChanges();
          }
        });
      }
    });
  }

  /**
   * Show a specific activity
   * @param activity_id
   */
  show_activity(activity_id) {
    this.logger.log('OPEN', activity_id, activity_id, 'open activity view');
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_view/' + activity_id]);
    });
  }

  /**
   * Edit a specific activity
   * @param activity_id
   */
  edit_activity(activity_id) {
    this.logger.log('OPEN', activity_id, activity_id, 'open activity edition');
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_edit/' + activity_id]);
    });
  }
}
