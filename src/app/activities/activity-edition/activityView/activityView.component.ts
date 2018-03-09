import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatChip, MatStepper} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {AppsService} from '../../../services/apps.service';
import {Location} from '@angular/common';
import {LoggerService} from '../../../services/logger.service';
import {UserService} from 'app/services/user.service';

@Component({
  selector: 'app-activity-edit',
  templateUrl: './activityView.component.html',
  styleUrls: ['./activityView.component.scss']
})

export class ActivityViewComponent implements AfterViewInit, OnInit {

  steps: any;
  editActivity: any;
  viewGroup: any;
  shareActivity: string;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('chip') chip: MatChip;

  constructor(public activityService: ActivityService,
              public router: Router,
              public appsService: AppsService,
              private _location: Location,
              private ref: ChangeDetectorRef,
              private logger: LoggerService,
              private user: UserService) {
    this.editActivity = '';
    this.viewGroup = '';
    this.shareActivity = '';
    if (this.activityService.activityLoaded.type === 'Main') {
      this.steps = this.activityService.activityLoadedChild;
    } else {
      this.steps = this.activityService.sisters;
    }
  }

  ngOnInit(): void {
    if (this.activityService.activityLoaded.master === true) {
      this.ref.detectChanges();
    }
    this.activityService.changes.subscribe(changes => {
      if (changes.type === 'ChangeActivity') {
        this.stepper.selectedIndex = this.steps.indexOf(changes.doc.currentLoaded);
        console.log(this.stepper.selectedIndex);
        this.ref.detectChanges();
      }
    });
  }

  /**
   * Set the current step to 'undefined' if the current activity is the main activity
   */
  ngAfterViewInit(): void {
    const activityId = this.activityService.activityLoaded.currentLoaded;
    if (this.activityService.activityLoaded.type === 'Main' && !isNullOrUndefined(activityId)) {
      this.stepper.selectedIndex = this.steps.indexOf(activityId);
      this.activityService.load_activity(activityId).then(res => {
        this.router.navigate(['activity_view/' + activityId]);
      });
    }
  }

  /**
   * Load an activity when the user clicks on a step
   * @param $event
   */
  loadActivity($event) {
    console.log(this.stepper, $event.selectedIndex);
    const activityId = this.steps[$event.selectedIndex];
    this.loadAnActivity(activityId);
  }

  backClicked() {
    this._location.back();
    if (this._location.path().includes('activity_view')) {
      const parts = this._location.path().split('/');
      const activityId = parts[parts.length - 1];
      this.activityService.setCurrentActivity(activityId).then(() => {
        this.activityService.load_activity(activityId).then(res => {
          this.stepper.selectedIndex = this.steps.indexOf(activityId);
          this.router.navigate(['activity_view/' + activityId]);
        });
      });
    }
  }

  /**
   * Load a specified activity
   * @param activityId
   */
  loadAnActivity(activityId) {
    this.activityService.setCurrentActivity(activityId).then(() => {
      this.activityService.load_activity(activityId).then(res => {
        this.router.navigate(['activity_view/' + activityId]);
      });
    });
  }

  activityGroupShare() {
    return -1;
  }

  activityGroupView() {
    const activityId = this.activityService.activityLoaded.parent;
    this.logger.log('OPEN', activityId, activityId, 'open activity duplicates');
    this.router.navigate(['duplicates/' + activityId]);
  }

  onHovering($event: Event) {
    this.editActivity = 'Editer l\'activité';
  }

  onUnovering($event: Event) {
    this.editActivity = '';
  }

  onHoveringGroupView($event: Event) {
    this.viewGroup = 'Voir les groupes';
  }

  onUnoveringGroupView($event: Event) {
    this.viewGroup = '';
  }

  onHoveringShare($event: Event) {
    this.shareActivity = 'Partager l\'activité';
  }

  onUnoveringShare($event: Event) {
    this.shareActivity = '';
  }

  activityEdit() {
    this.logger.log('OPEN', this.activityService.activityLoaded.parent, this.activityService.activityLoaded.parent, 'open activity edition');
    this.activityService.load_activity(this.activityService.activityLoaded.parent).then(res => {
      this.router.navigate(['activity_edit/' + this.activityService.activityLoaded.parent]);
    });
  }
}
