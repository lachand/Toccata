import {Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {DialogConfirmationComponent} from '../../dialogConfirmation/dialogConfirmation.component';
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'view-duplicates',
  templateUrl: './viewDuplicates.component.html',
  styleUrls: ['./viewDuplicates.component.scss']
})

export class ViewDuplicatesComponent {
  duplicateList: any;
  @Input() activityId;
  activityInfo;

  constructor(public user: UserService,
              public activityService: ActivityService,
              public database: DatabaseService,
              public route: ActivatedRoute) {
    this.route.params.subscribe(result => {
      this.activityId = result.id;
    });
    this.activityService.getActivityInfos(this.activityId).then(infos => {
      this.activityInfo = infos;
    })
    this.activityService.getActivityDuplicate(this.activityId).then(list => {
      this.duplicateList = list;
      return Promise.all(this.duplicateList.map(duplicate => {
        this.database.addDatabase(duplicate);
      }));
    });
  }
}
