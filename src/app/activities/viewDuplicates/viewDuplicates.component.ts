import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UserService} from '../../services/user.service';
import {DatabaseService} from '../../services/database.service';
import {Location} from '@angular/common';
import {LoggerService} from '../../services/logger.service';
import {DialogDuplicateNameComponent} from "./dialogDuplicateName/dialogDuplicateName.component";

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
  creation: any;

  constructor(public user: UserService,
              public activityService: ActivityService,
              public database: DatabaseService,
              private route: ActivatedRoute,
              private _location: Location,
              private logger: LoggerService,
              private dialog: MatDialog,
              private router: Router,
              private ref: ChangeDetectorRef) {
    this.creation = false;
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

    this.activityService.changes.subscribe(change => {
      console.log(change);
      if (change.type === 'Activity') {
        console.log("changes in activity");
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      }
    });
  }

  duplicateActivity() {
    let activityId;

    if (this.activityService.activityLoaded.type === 'Main') {
      activityId = this.activityService.activityLoaded._id;
    } else {
      activityId = this.activityService.activityLoaded.parent;
    }

    const dialogRef = this.dialog.open(DialogDuplicateNameComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.type === 'validate') {
        this.creation = true;
        this.logger.log('CREATE', activityId, activityId, 'duplicate activity');
        this.activityService.duplicateActivity(activityId, result.value).then( () => {

          this.activityService.getActivityDuplicate(this.activityId).then((list: Array<any>) => {
            return Promise.all(list.map(duplicate => {
              this.database.addDatabase(duplicate);
            })).then(() => {
              this.duplicateList = list;
            });
          });

          if (!this.ref['destroyed']) {
            this.ref.detectChanges();
          }
          this.creation = false;
        });
      }
    });

  }
}
