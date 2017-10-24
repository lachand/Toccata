import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-activity-infos',
  templateUrl: './activityInfos.component.html',
  styleUrls: ['./activityInfos.component.scss']
})

export class ActivityInfosComponent implements OnInit {

  @Input() activityId;
  activityInfos: any;

  constructor(public user: UserService,
              public activityService: ActivityService,
              public router: Router) {
  }

  ngOnInit(): void {
    console.log(this.activityId);
    this.activityService.getActivityInfos(this.activityId).then(activityInfos => {
      this.activityInfos = activityInfos;
    });
    console.log(this.activityInfos);
  }

  load_activity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_apps/' + activity_id]);
    });
  }

  show_activity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_view/' + activity_id]);
    });
  }

  edit_activity(activity_id) {
    this.activityService.load_activity(activity_id).then(res => {
      this.router.navigate(['activity_edit/' + activity_id]);
    });
  }

  view_or_edit(activityId) {
    if (this.user.fonction === 'Enseignant') {
      this.edit_activity(activityId);
    } else {
      this.show_activity(activityId);
    }
  }

  activity_change_status(activityId, status) {
    if (this.user.fonction === 'Enseignant') {
      return this.user.setActivityStatusByTeacher(activityId, status);
    } else {
      return this.user.setActivityStatusByStudent(activityId, status);
    }
  }
}
