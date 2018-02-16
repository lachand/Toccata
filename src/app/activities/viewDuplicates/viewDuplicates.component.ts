import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {DialogConfirmationComponent} from '../../dialogConfirmation/dialogConfirmation.component';
import {DatabaseService} from "../../services/database.service";
import {Location} from "@angular/common";
import {LoggerService} from "../../services/logger.service";

@Component({
  selector: 'view-duplicates',
  templateUrl: './viewDuplicates.component.html',
  styleUrls: ['./viewDuplicates.component.scss']
})

export class ViewDuplicatesComponent {
  duplicateList: any;
  @Input() activityId;
  activityInfo;
  editActivity: string;
  viewActivity: string;

  constructor(public user: UserService,
              public activityService: ActivityService,
              public database: DatabaseService,
              private route: ActivatedRoute,
              private _location: Location,
              private logger: LoggerService,
              private router: Router) {
    this.editActivity = '';
    this.viewActivity = '';
    this.route.params.subscribe(result => {
      this.activityId = result.id;
    });
    this.activityService.getActivityInfos(this.activityId).then(infos => {
      this.activityInfo = infos;
    });
    this.activityService.getActivityDuplicate(this.activityId).then((list: Array<any>) => {
      return Promise.all(list.map(duplicate => {
        this.database.addDatabase(duplicate);
      })).then(() => {
        this.duplicateList = list;
      });
    });
  }

  backClicked() {
    this._location.back();
  }

  activityView() {
    const activityId = this.activityService.activityLoaded._id;
    this.logger.log('OPEN', activityId, activityId, 'open activity');
    this.router.navigate(['activity_view/' + activityId]);
  }

  onHovering($event: Event) {
    this.editActivity = "Editer l'activité";
  }

  onUnovering($event: Event) {
    this.editActivity = '';
  }

  onHoveringView($event: Event) {
    this.viewActivity = "Voir l'activité";
  }

  onUnoveringView($event: Event) {
    this.viewActivity = '';
  }

  activityEdit() {
    const activityId = this.activityService.activityLoaded._id;
    this.logger.log('OPEN', activityId, activityId, 'open activity edition');
    this.activityService.load_activity(activityId).then(res => {
      this.router.navigate(['activity_edit/' + activityId]);
    });
  }
}
