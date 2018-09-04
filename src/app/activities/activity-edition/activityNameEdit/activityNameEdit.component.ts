import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {LoggerService} from '../../../services/logger.service';
import {Router} from '@angular/router';

@Component({
  selector: 'activity-name-edit',
  templateUrl: './activityNameEdit.component.html',
  styleUrls: ['./activityNameEdit.component.scss']
})

export class ActivityNameEditComponent implements OnInit {
  nameEdition: boolean;
  appName: String = '';
  viewActivity: any;
  viewGroup: any;
  @Input() edit: boolean;
  @Input() activityId: string;
  @Input() type: string;

  constructor (public activityService: ActivityService, private logger: LoggerService, private router: Router, private ref: ChangeDetectorRef) {

    this.activityService.changes.subscribe(change => {
      if ((change.type === 'Main' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded._id && change.doc.type === 'Sequence' && this.type === 'Loaded') {
        this.appName = change.doc.name;
      } else if ((change.type === 'Main' || change.type === 'Sequence') && change.doc._id === this.activityService.activityLoaded.parent && change.doc.type === 'Main' && this.type === 'Parent') {
        this.appName = change.doc.name;
      }
      if (change.type === 'ChangeActivity' && this.type === 'Loaded') {
        console.log(change.type);
        this.appName = change.doc.name;
      }
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    });
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

    let id = '';

    if (this.type === 'Loaded') {
      id = this.activityService.activityLoaded._id;
    } else {
      id = this.activityService.activityLoaded.parent ;
    }

    this.activityService.activityEdit(id, 'name', this.appName)
      .then(() => {
        this.switch();
      });
  }

  onHovering($event: Event) {
    this.viewActivity = 'Voir l\'activité';
  }

  onUnovering($event: Event) {
    this.viewActivity = '';
  }

  onHoveringGroupView($event: Event) {
    this.viewGroup = 'Voir les groupes';
  }

  onUnoveringGroupView($event: Event) {
    this.viewGroup = '';
  }

  activityView() {
    this.logger.log('OPEN', this.activityService.activityLoaded._id, this.activityService.activityLoaded._id, 'open activity view');
    this.activityService.load_activity(this.activityService.activityLoaded._id).then(res => {
      this.router.navigate(['activity_view/' + this.activityService.activityLoaded._id]);
    });
  }

  activityGroupView() {
    let activityId = '';
    if (this.activityService.activityLoaded.type === 'Main') {
      activityId = this.activityService.activityLoaded._id.split('_duplicate')[0];
    } else {
      activityId = this.activityService.activityLoaded.parent.split('_duplicate')[0];
    }
    this.logger.log('OPEN', activityId, activityId, 'open activity duplicates');
    this.router.navigate(['duplicates/' + activityId]);
  }

  ngOnInit() {
    console.log(this.type);
    if (this.type === 'Loaded') {
      this.appName = this.activityService.activityLoaded.name;
    } else {
      this.activityService.getActivityInfos(this.activityService.activityLoaded.parent).then(res => {
        this.appName = res['name'];
      });
    }
    console.log(this.appName);
  }

}
